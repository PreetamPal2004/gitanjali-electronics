import mongoose, { Document, Schema } from "mongoose"

interface ICartProduct {
    productId: string
    quantity: number
    priceAtTime: number
}

export interface ICart extends Document {
    user: mongoose.Types.ObjectId
    products: ICartProduct[]
    totalPrice: number
    updatedAt: Date
}

const CartSchema = new Schema<ICart>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true, // One cart per user
            index: true, // Index for fast lookups
        },
        products: [
            {
                productId: {
                    type: String,
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: [1, "Quantity must be at least 1"],
                },
                priceAtTime: {
                    type: Number,
                    required: true,
                    min: [0, "Price cannot be negative"],
                },
            },
        ],
        totalPrice: {
            type: Number,
            default: 0,
            min: [0, "Total price cannot be negative"],
        },
    },
    {
        timestamps: true,
    }
)

// Calculate total price before saving
// Calculate total price before saving
CartSchema.pre("save", function (this: ICart) {
    if (this.products && this.products.length > 0) {
        this.totalPrice = this.products.reduce((sum, item) => {
            return sum + (item.priceAtTime * item.quantity);
        }, 0);
    } else {
        this.totalPrice = 0;
    }
});

export default mongoose.models.Cart || mongoose.model<ICart>("Cart", CartSchema)
