const express = require("express");
const slugify = require("slugify");
const ExpressError = require("../expressError")
const db = require("../db");

let router = new express.Router();


router.get("/", async function (req, res, next) {
    try {
        const result = await db.query(
                `SELECT code, name
                FROM companies
                ORDEr BY name`
        );

        return res.json({"companies": result.rows});
    }

    catch (err) {
        return next(err);
    }
});


router.get("/:code", async function (req, res, next) {
    try {
        let code = req.params.code;

        const compResult = await db.query(
            `SELECT code, name, description
            FROM conpanies
            WHERE code = $1`,
            [code]
        );

        const invResult = await db.query(
            `SLECT id
            FROM invoices
            WHERE comp_code = $1`,
            [code]
        );

        if (compResult.rows.length === 0) {
            throw new ExpressError(`no such company: ${code}`, 404)
        }
        
        const company = compResult.rows[0];
        const invoices = invResult.rows;
        
        company.invoices = invoices.map(inv => inv.id);

        return res.json({"company": company});

    }

    catch (err) {
        return next(err);
    }
});