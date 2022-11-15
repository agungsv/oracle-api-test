const express = require('express');
const router = express.Router();
const redisCache = require('../config/redis_cache_conf');

const cInventoryItem = require("../controllers/inventory_items");

router.get("/:inventoryItemId/price", cInventoryItem.findInventoryItemPriceByPricelistUom);

module.exports = router;
