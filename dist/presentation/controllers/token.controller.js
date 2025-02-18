"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenController = void 0;
const tsyringe_1 = require("tsyringe");
const stripe_1 = __importDefault(require("stripe"));
let TokenController = class TokenController {
    constructor(userRepository) {
        this.userRepository = userRepository;
        this.getBalance = async (req, res) => {
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
            }
            catch (error) {
                console.error("Error fetching token balance:", error);
                res.status(500).json({ error: "Failed to fetch token balance" });
            }
        };
        this.purchaseTokens = async (req, res) => {
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
                const paymentIntent = await this.stripe.paymentIntents.create({
                    amount: totalAmount,
                    currency: "usd",
                    customer: user.stripeCustomerId,
                    payment_method: paymentMethodId,
                    confirm: true,
                    description: `Purchase of ${amount} tokens`,
                });
                if (paymentIntent.status === "succeeded") {
                    // Update user's token balance
                    const updatedUser = await this.userRepository.updateUser(user.id, {
                        tokens: user.tokens + amount,
                    });
                    // Record the purchase
                    await this.userRepository.recordTokenPurchase(user.id, amount, totalAmount);
                    res.json({
                        success: true,
                        newBalance: updatedUser.tokens,
                        transactionId: paymentIntent.id,
                    });
                }
                else {
                    res.status(400).json({
                        error: "Payment failed",
                        status: paymentIntent.status,
                    });
                }
            }
            catch (error) {
                console.error("Error purchasing tokens:", error);
                res.status(500).json({ error: "Failed to purchase tokens" });
            }
        };
        this.stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, {
            apiVersion: "2025-01-27.acacia",
        });
    }
};
exports.TokenController = TokenController;
exports.TokenController = TokenController = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("UserRepository")),
    __metadata("design:paramtypes", [Object])
], TokenController);
