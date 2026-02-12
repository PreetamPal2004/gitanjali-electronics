import mongoose, { Document, Schema } from "mongoose"

interface IWishlistProduct {
    productId: string
    addedAt: Date
}

export interface IWishlist extends Document {
    user: mongoose.Types.ObjectId
    products: IWishlistProduct[]
    updatedAt: Date
}

const WishlistSchema = new Schema<IWishlist>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
            index: true,
        },
        products: [
            {
                productId: {
                    type: String,
                    required: true,
                },
                addedAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
    },
    {
        timestamps: true,
    }
)

export default mongoose.models.Wishlist || mongoose.model<IWishlist>("Wishlist", WishlistSchema)
