'use client'

import ProductVariantCard from '@/components/ProductVariantCard'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useCart } from '@/stores/useCart'
import { useModals } from '@/stores/useModals'
import { ModalType } from '@/types'
import { Fragment, useState } from 'react'

export const CartModal = () => {
  const { isOpen, type, close, data } = useModals()
  const { add } = useCart()
  const [quantityToBuy, setQuantityToBuy] = useState(1)

  const addToCart = () => {
    if (data) {
      add({ ...data, quantityToBuy })
      close()
    }
  }

  console.log(data)
  return (
    <Dialog open={type === ModalType.ADD_TO_CART && isOpen} onOpenChange={close}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogTitle className="text-center text-2xl font-bold">Add to Cart</DialogTitle>
        <DialogDescription>
          Add this item to your cart. You can adjust the quantity in your cart before checking out
        </DialogDescription>
        {data && (
          <Fragment>
            <div className="mt-4">
              <ProductVariantCard productVariant={data} showImage />
            </div>
            <div className="mt-4 flex items-center gap-4">
              <Input
                type="number"
                max={data.quantity}
                value={quantityToBuy}
                onChange={(e) =>
                  setQuantityToBuy(Math.max(1, Number.parseInt(e.target.value) || 1))
                }
                className="w-20"
              />
              <Button onClick={addToCart} className="flex-grow">
                Add to Cart
              </Button>
            </div>
          </Fragment>
        )}
      </DialogContent>
    </Dialog>
  )
}
