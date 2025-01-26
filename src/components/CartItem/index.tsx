'use client'

import { type CartProductVariant, useCart } from '@/stores/useCart'
import React from 'react'
import { Button } from '../ui/button'
import { X } from 'lucide-react'

export function CartItem({ cartProductVariant }: { cartProductVariant: CartProductVariant }) {
  const { title, price, quantityToBuy } = cartProductVariant
  const { remove } = useCart()

  const totalPrice = price * quantityToBuy

  return (
    <div className="flex items-center gap-6 py-4 border-b last:border-b-0">
      <div className="flex-grow space-y-1">
        <h3 className="text-sm font-medium">{title}</h3>
        <p className="text-sm text-muted-foreground">${price.toFixed(2)} each</p>
      </div>
      <div className="flex flex-col items-end gap-2">
        <span className="text-sm text-muted-foreground">
          {quantityToBuy} x ${price.toFixed(2)}
        </span>
      </div>
      <span className="text-sm font-semibold">${totalPrice.toFixed(2)}</span>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-muted-foreground hover:text-destructive"
        onClick={() => remove(cartProductVariant)}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  )
}
