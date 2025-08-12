ALTER TABLE "orders"
    ADD CONSTRAINT "order_amount_positive" CHECK ("amount" > 0);
