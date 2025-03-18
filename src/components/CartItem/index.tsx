'use client'

import { type CartProductVariant, useCart } from '@/stores/useCart'
import React from 'react'
import { Button } from '../ui/button'
import { Minus, Plus, X } from 'lucide-react'
import { formatVND } from '@/utilities/currency'

export function CartItem({ cartProductVariant }: { cartProductVariant: CartProductVariant }) {
  const { title, price, quantityToBuy, discount } = cartProductVariant
  const { remove, plus, minus } = useCart()

  const totalPrice = price * quantityToBuy
  const totalPriceWithDiscount = totalPrice - totalPrice * ((discount || 0) / 100)

  return (
    <div className="flex items-center gap-1 py-4 border-b last:border-b-0">
      <div className="flex-grow space-y-1">
        <h3 className="text-sm font-medium">{title}</h3>
        <p className="text-sm text-muted-foreground">{formatVND(totalPriceWithDiscount)} mỗi cái</p>
      </div>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => minus(cartProductVariant.id)}
          disabled={quantityToBuy <= 1}
        >
          <Minus className="h-2 w-2" />
        </Button>
        <span className="text-sm font-medium w-8 text-center">{quantityToBuy}</span>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => plus(cartProductVariant.id)}
        >
          <Plus className="h-2 w-2" />
        </Button>
      </div>
      <div className="flex flex-col items-end gap-1">
        <span className="text-sm font-semibold">{formatVND(totalPriceWithDiscount)}</span>
      </div>
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
