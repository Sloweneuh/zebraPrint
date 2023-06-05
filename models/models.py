# -*- coding: utf-8 -*-

from odoo import models, fields, api

class zebraPrint(models.Model):
    _inherit = ['product.template']
    _description = "Zebra Print"

    transaction_ids = fields.Many2many('payment.transaction', 'zebra_transaction_rel', 'zebra_id', 'transaction_id', string='Transactions', copy=False, readonly=True)
    tag_ids = fields.Many2many('crm.tag', 'zebra_tag_rel', 'zebra_id', 'tag_id', string='Tags')

    def action_zebra_print(self):
        return True
