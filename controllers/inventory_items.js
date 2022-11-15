const mInventoryItems = require("../models/inventory_items");

module.exports = {
  findInventoryItemPriceByPricelistUom: async (req, res) => {
    let resStatus = 200;
    let resData = null;
    let resMessage = null;

    try{
      const inventoryItemId = (req.params.inventoryItemId && req.params.inventoryItemId.toLowerCase() !== 'null') ? req.params.inventoryItemId : null;
      const pricelistId = (req.query.pricelist_id && req.query.pricelist_id.toLowerCase() !== 'null') ? req.query.pricelist_id : null;
      const uomCode = (req.query.uom_code && req.query.uom_code.toLowerCase() !== 'null') ? req.query.uom_code.toUpperCase() : null;
      
      if(!inventoryItemId || !pricelistId){
        const error = new Error("Invalid parameter(s) supplied");
        error.status = 400;
        throw error;
      }

      const inventoryItemPriceData = await mInventoryItems.findItemPriceByPricelist(inventoryItemId, pricelistId, uomCode);

      if(!inventoryItemPriceData.length){
        const error = new Error("Inventory Item has no price");
        error.status = 404;
        throw error;
      }

      resData = inventoryItemPriceData;
    } catch(err){
      console.log(err);

      resStatus = 500;
      resMessage = err.message;

      if(typeof(err.status)==='number'){
        resStatus = err.status;
      }
    } finally{
      return res.status(resStatus).json({
        data: resData,
        message: resMessage
      });
    }
  }
};
