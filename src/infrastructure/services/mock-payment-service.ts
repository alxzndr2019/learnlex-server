import { injectable } from "tsyringe";

interface PaymentMethod {
  id: string;
  type: string;
  last4: string;
  brand: string;
  exp_month: number;
  exp_year: number;
  metadata?: { isDefault?: string };
}

interface Subscription {
  id: string;
  metadata: { plan: string; features: string };
  items: {
    data: Array<{
      id: string;
      price: {
        unit_amount: number;
        recurring?: { interval: string };
      };
    }>;
  };
  start_date: number;
  current_period_end: number;
}

interface Transaction {
  id: string;
  created: number;
  amount: number;
  description: string;
  status: string;
}

@injectable()
export class MockPaymentService {
  private paymentMethods: Map<string, PaymentMethod[]> = new Map();
  private subscriptions: Map<string, Subscription[]> = new Map();
  private transactions: Map<string, Transaction[]> = new Map();

  async createPaymentIntent(
    amount: number,
    currency: string,
    customerId: string,
    paymentMethodId: string,
    description: string
  ) {
    const transaction: Transaction = {
      id: `mock_pi_${Date.now()}`,
      created: Math.floor(Date.now() / 1000),
      amount,
      description,
      status: "succeeded",
    };

    const customerTransactions = this.transactions.get(customerId) || [];
    customerTransactions.push(transaction);
    this.transactions.set(customerId, customerTransactions);

    return {
      id: transaction.id,
      status: "succeeded",
    };
  }

  async listSubscriptions(customerId: string, limit: number = 1) {
    const subs = this.subscriptions.get(customerId) || [];
    return {
      data: subs.slice(0, limit),
    };
  }

  async createSubscription(customerId: string, priceId: string, plan: string) {
    const subscription: Subscription = {
      id: `mock_sub_${Date.now()}`,
      metadata: {
        plan,
        features: JSON.stringify(this.getPlanFeatures(plan)),
      },
      items: {
        data: [
          {
            id: `mock_item_${Date.now()}`,
            price: {
              unit_amount: this.getPlanPrice(plan) * 100,
              recurring: { interval: "month" },
            },
          },
        ],
      },
      start_date: Math.floor(Date.now() / 1000),
      current_period_end: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60, // 30 days
    };

    const customerSubs = this.subscriptions.get(customerId) || [];
    customerSubs.push(subscription);
    this.subscriptions.set(customerId, customerSubs);

    return subscription;
  }

  async updateSubscription(
    subscriptionId: string,
    priceId: string,
    plan: string
  ) {
    // Find and update the subscription across all customers
    for (const [customerId, subs] of this.subscriptions.entries()) {
      const subIndex = subs.findIndex((s) => s.id === subscriptionId);
      if (subIndex !== -1) {
        subs[subIndex] = {
          ...subs[subIndex],
          metadata: {
            plan,
            features: JSON.stringify(this.getPlanFeatures(plan)),
          },
          items: {
            data: [
              {
                id: subs[subIndex].items.data[0].id,
                price: {
                  unit_amount: this.getPlanPrice(plan) * 100,
                  recurring: { interval: "month" },
                },
              },
            ],
          },
        };
        this.subscriptions.set(customerId, subs);
        return subs[subIndex];
      }
    }
    throw new Error("Subscription not found");
  }

  async listPaymentMethods(customerId: string, type: string = "card") {
    return {
      data: this.paymentMethods.get(customerId) || [],
    };
  }

  async attachPaymentMethod(paymentMethodId: string, customerId: string) {
    const paymentMethod: PaymentMethod = {
      id: paymentMethodId,
      type: "card",
      last4: "4242", // Mock data
      brand: "visa",
      exp_month: 12,
      exp_year: 2025,
    };

    const customerMethods = this.paymentMethods.get(customerId) || [];
    customerMethods.push(paymentMethod);
    this.paymentMethods.set(customerId, customerMethods);

    return paymentMethod;
  }

  async detachPaymentMethod(paymentMethodId: string) {
    // Remove the payment method from all customers
    for (const [customerId, methods] of this.paymentMethods.entries()) {
      const updatedMethods = methods.filter((m) => m.id !== paymentMethodId);
      this.paymentMethods.set(customerId, updatedMethods);
    }
  }

  async listTransactions(
    customerId: string,
    limit: number = 10,
    startingAfter?: string
  ) {
    const transactions = this.transactions.get(customerId) || [];
    let startIndex = 0;

    if (startingAfter) {
      const index = transactions.findIndex((t) => t.id === startingAfter);
      if (index !== -1) {
        startIndex = index + 1;
      }
    }

    return {
      data: transactions.slice(startIndex, startIndex + limit),
      has_more: transactions.length > startIndex + limit,
    };
  }

  private getPlanFeatures(plan: string): string[] {
    switch (plan) {
      case "free":
        return [
          "5 video conversions/month",
          "Basic AI summaries",
          "Standard quizzes",
        ];
      case "pro":
        return [
          "Unlimited video conversions",
          "Advanced AI summaries",
          "Custom quizzes",
          "Priority support",
        ];
      default:
        return [];
    }
  }

  private getPlanPrice(plan: string): number {
    switch (plan) {
      case "free":
        return 0;
      case "pro":
        return 29;
      default:
        return 0;
    }
  }
}
