const mongoose=require("mongoose");

const InventoryItemSchema= new mongoose.Schema({
  name: { type: String, required: true },
  stock: { type: Number, required: true },
  reorderLevel: { type: Number, required: true },
  isReordering: { type: Boolean, default: false },
  orderSource: { type: String },
  orderDate: { type: Date },
  expectedArrival: { type: Date },
  supplier: {
    name: { type: String },
    contact: { type: String },
    productUrl: { type: String }

  },
  orderStatus: {
    type: String,
    enum: ['pending', 'shipped', 'delivered', 'cancelled'],
    default:"pending" },

},{ timestamps: true })

module.exports=mongoose.model("Inventory",InventoryItemSchema);