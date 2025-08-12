ALTER TABLE "items"
    ADD CONSTRAINT "item_amount_positive" CHECK ("amount" > 0),
    ADD CONSTRAINT "item_quantity_positive" CHECK ("quantity" > 0);
