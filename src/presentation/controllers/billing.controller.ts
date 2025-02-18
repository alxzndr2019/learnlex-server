import { Request, Response } from "express";
import { injectable, inject } from "tsyringe";
import { UserRepository } from "../../application/interfaces/user-repository";
import Stripe from "stripe";

@injectable()
export class BillingController {
  private stripe: Stripe;

  constructor(
    @inject("UserRepository") private readonly userRepository: UserRepository
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2025-01-27.acacia",
    });
  }

  getCurrentPlan = async (req: Request, res: Response) => {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const user = await this.userRepository.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const subscription = await this.stripe.subscriptions.list({
        customer: user.stripeCustomerId,
        limit: 1,
      });

      if (!subscription.data.length) {
        return res.json({
          plan: "free",
          price: 0,
          interval: "month",
          features: [
            "5 video conversions/month",
            "Basic AI summaries",
            "Standard quizzes",
          ],
          startDate: null,
          nextBillingDate: null,
        });
      }

      const sub = subscription.data[0];
      res.json({
        plan: sub.metadata.plan,
        price: sub.items.data[0].price.unit_amount! / 100,
        interval: sub.items.data[0].price.recurring?.interval,
        features: JSON.parse(sub.metadata.features || "[]"),
        startDate: new Date(sub.start_date * 1000),
        nextBillingDate: new Date(sub.current_period_end * 1000),
      });
    } catch (error) {
      console.error("Error fetching plan:", error);
      res.status(500).json({ error: "Failed to fetch plan details" });
    }
  };

  updatePlan = async (req: Request, res: Response) => {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const { plan, interval } = req.body;
      const user = await this.userRepository.findById(req.user.id);

      if (!user || !user.stripeCustomerId) {
        return res.status(404).json({ error: "User not found" });
      }

      // Get price ID based on plan and interval
      const prices = await this.stripe.prices.list({
        lookup_keys: [`${plan}_${interval}`],
        active: true,
      });

      if (!prices.data.length) {
        return res.status(400).json({ error: "Invalid plan selected" });
      }

      const subscription = await this.stripe.subscriptions.list({
        customer: user.stripeCustomerId,
        limit: 1,
      });

      if (subscription.data.length) {
        // Update existing subscription
        await this.stripe.subscriptions.update(subscription.data[0].id, {
          items: [
            {
              id: subscription.data[0].items.data[0].id,
              price: prices.data[0].id,
            },
          ],
        });
      } else {
        // Create new subscription
        await this.stripe.subscriptions.create({
          customer: user.stripeCustomerId,
          items: [{ price: prices.data[0].id }],
        });
      }

      res.json({ success: true });
    } catch (error) {
      console.error("Error updating plan:", error);
      res.status(500).json({ error: "Failed to update plan" });
    }
  };

  getPaymentMethods = async (req: Request, res: Response) => {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const user = await this.userRepository.findById(req.user.id);
      if (!user || !user.stripeCustomerId) {
        return res.status(404).json({ error: "User not found" });
      }

      const paymentMethods = await this.stripe.paymentMethods.list({
        customer: user.stripeCustomerId,
        type: "card",
      });

      res.json({
        methods: paymentMethods.data.map((method) => ({
          id: method.id,
          type: method.type,
          last4: method.card?.last4,
          brand: method.card?.brand,
          expiryMonth: method.card?.exp_month,
          expiryYear: method.card?.exp_year,
          isDefault: method.metadata?.isDefault === "true",
        })),
      });
    } catch (error) {
      console.error("Error fetching payment methods:", error);
      res.status(500).json({ error: "Failed to fetch payment methods" });
    }
  };

  addPaymentMethod = async (req: Request, res: Response) => {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const { paymentMethodId } = req.body;
      const user = await this.userRepository.findById(req.user.id);

      if (!user || !user.stripeCustomerId) {
        return res.status(404).json({ error: "User not found" });
      }

      await this.stripe.paymentMethods.attach(paymentMethodId, {
        customer: user.stripeCustomerId,
      });

      res.json({ success: true });
    } catch (error) {
      console.error("Error adding payment method:", error);
      res.status(500).json({ error: "Failed to add payment method" });
    }
  };

  removePaymentMethod = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await this.stripe.paymentMethods.detach(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error removing payment method:", error);
      res.status(500).json({ error: "Failed to remove payment method" });
    }
  };

  getTransactions = async (req: Request, res: Response) => {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const { limit = 10, offset = 0 } = req.query;
      const user = await this.userRepository.findById(req.user.id);

      if (!user || !user.stripeCustomerId) {
        return res.status(404).json({ error: "User not found" });
      }

      const charges = await this.stripe.charges.list({
        customer: user.stripeCustomerId,
        limit: Number(limit),
        starting_after: offset ? String(offset) : undefined,
      });

      res.json({
        transactions: charges.data.map((charge) => ({
          id: charge.id,
          date: new Date(charge.created * 1000),
          amount: charge.amount / 100,
          description: charge.description,
          status: charge.status,
        })),
        total: charges.has_more ? undefined : charges.data.length,
      });
    } catch (error) {
      console.error("Error fetching transactions:", error);
      res.status(500).json({ error: "Failed to fetch transactions" });
    }
  };
}
