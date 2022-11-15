const oracledb = require("../config/oracle_pool_conf");

module.exports = {
  findItemPriceByPricelist: async (inventoryItemId, pricelistId, uomCode) => {
    let connection;
    try{
      connection = await oracledb.getConnection();

      const sql = "SELECT qppr.list_header_id, qppr.product_attr_value, qppr.product_uom_code, qpll.operand, CASE WHEN QLH.NAME LIKE '%EXCLUDE%' THEN CASE WHEN QLHB.CURRENCY_CODE = 'IDR' THEN ROUND(qpll.OPERAND + (qpll.OPERAND * 11 / 100),2) WHEN QLHB.CURRENCY_CODE <> 'IDR' THEN ROUND(qpll.OPERAND + (qpll.OPERAND * 11 / 100), 2) END ELSE CASE WHEN QLHB.CURRENCY_CODE = 'IDR' THEN ROUND(qpll.OPERAND,2) WHEN QLHB.CURRENCY_CODE <> 'IDR' THEN ROUND(qpll.OPERAND, 2) END END operand_incl_tax, qlhb.currency_code, qpll.start_date_active, qpll.end_date_active FROM QP_LIST_HEADERS_TL QLH, QP_LIST_HEADERS_B QLHB, qp_list_lines qpll, qp_pricing_attributes qppr WHERE QLH.LIST_HEADER_ID = QLHB.LIST_HEADER_ID AND QLH.LIST_HEADER_ID = qpll.LIST_HEADER_ID AND QLH.LIST_HEADER_ID = qppr.LIST_HEADER_ID AND qpll.LIST_LINE_ID = qppr.LIST_LINE_ID AND qppr.list_line_id = qpll.list_line_id AND qpll.list_line_type_code IN ('PLL', 'PBH') AND qppr.pricing_phase_id = 1 AND qppr.qualification_ind IN (4, 6, 20, 22) AND qpll.pricing_phase_id = 1 AND qpll.qualification_ind IN (4, 6, 20, 22) AND qppr.list_header_id = :pricelistId AND qppr.product_attr_value = :inventoryItemId AND qppr.product_uom_code = NVL(:itemUomCode, qppr.product_uom_code) AND ( (qppr.ROWID = ( SELECT ROWID FROM qp_pricing_attributes WHERE qppr.list_line_id = list_line_id AND pricing_attribute_context = 'PRICING ATTRIBUTE' AND pricing_attribute = 'PRICING_ATTRIBUTE11' AND ROWNUM < 2) ) OR ( qppr.ROWID = ( SELECT ROWID FROM qp_pricing_attributes WHERE qppr.list_line_id = list_line_id AND pricing_attribute_context IS NULL AND pricing_attribute IS NULL AND excluder_flag = 'N') AND NOT EXISTS ( SELECT NULL FROM qp_pricing_attributes WHERE qppr.list_line_id = list_line_id AND pricing_attribute_context = 'PRICING ATTRIBUTE' AND pricing_attribute = 'PRICING_ATTRIBUTE11' ))) AND NVL(qpll.start_date_active, SYSDATE + 0.99999) <= SYSDATE AND NVL(TRUNC(qpll.end_date_active) + 0.99999, SYSDATE + 0.99999) >= SYSDATE";

      const bind = {
        inventoryItemId: inventoryItemId,
        pricelistId: pricelistId,
        itemUomCode: uomCode
      };

      const query = await connection.execute(sql, bind);

      return query.rows;
    } catch (err){
      throw err;
    } finally{
      if (connection){
        await connection.close();
      }
    }
  }
}
