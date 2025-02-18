import { Request, Response } from "express";
import { injectable, inject } from "tsyringe";
import { UserRepository } from "../../application/interfaces/user-repository";
import { MockPaymentService } from "../../infrastructure/services/mock-payment-service";

@injectable()
export class TokenController {
  constructor(
    @inject("UserRepository") private readonly userRepository: UserRepository,
    @inject("PaymentService")
    private readonly paymentService: MockPaymentService
  ) {}

  getBalance = async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const user = await this.userRepository.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Get token usage history from database
      const usage = await this.userRepository.getTokenUsage(user.id);

      res.json({
        balance: user.tokens,
        usage: usage.map((entry) => ({
          date: entry.date,
          amount: entry.amount,
          action: entry.action,
        })),
      });
    } catch (error) {
      console.error("Error fetching token balance:", error);
      res.status(500).json({ error: "Failed to fetch token balance" });
    }
  };

  purchaseTokens = async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const { amount, paymentMethodId } = req.body;
      const user = await this.userRepository.findById(req.user.id);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Calculate price (e.g., $1 per token)
      const unitPrice = 100; // in cents
      const totalAmount = amount * unitPrice;

      // Create payment intent
      const paymentIntent = await this.paymentService.createPaymentIntent(
        totalAmount,
        "usd",
        user.id,
        paymentMethodId,
        `Purchase of ${amount} tokens`
      );

      if (paymentIntent.status === "succeeded") {
        // Update user's token balance
        const updatedUser = await this.userRepository.updateUser(user.id, {
          tokens: user.tokens + amount,
        });

        // Record the purchase
        await this.userRepository.recordTokenPurchase(
          user.id,
          amount,
          totalAmount
        );

        res.json({
          success: true,
          newBalance: updatedUser.tokens,
          transactionId: paymentIntent.id,
        });
      } else {
        res.status(400).json({
          error: "Payment failed",
          status: paymentIntent.status,
        });
      }
    } catch (error) {
      console.error("Error purchasing tokens:", error);
      res.status(500).json({ error: "Failed to purchase tokens" });
    }
  };
}
