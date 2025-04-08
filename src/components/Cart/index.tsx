'use client'

import { Button, buttonVariants } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useCart } from '@/stores/useCart'
import { CartItem } from '../CartItem'
import { Checkbox } from '@/components/ui/checkbox'
import Link from 'next/link'
import { cn } from '@/utilities/ui'

export function Cart() {
  const { items, setIsBuying } = useCart()
  const totalItems = items.reduce((sum, item) => sum + item.quantityToBuy, 0)

  return (
    <Sheet>
      <Tooltip>
        <SheetTrigger asChild>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="border-border size-8 shrink-0 border relative"
            >
              <CartIcon className="size-4 dark:text-white text-black" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
              <span className="sr-only">Giỏ hàng ({totalItems} sản phẩm)</span>
            </Button>
          </TooltipTrigger>
        </SheetTrigger>
        <TooltipContent align="end">Giỏ hàng ({totalItems} sản phẩm)</TooltipContent>
        <SheetContent side="right" className="flex flex-col gap-1 p-3 pt-14">
          <SheetTitle></SheetTitle>
          {items.length === 0 ? (
            <div className="text-center">Giỏ hàng của bạn đang trống.</div>
          ) : (
            <>
              {items.map((item) => (
                <div className="flex flex-col gap-2" key={item.id}>
                  <CartItem cartProductVariant={item} />
                </div>
              ))}
              <div className="flex flex-col gap-2 mt-auto pt-6 border-t">
                <Link
                  href="/orders"
                  className={cn(
                    buttonVariants({ variant: 'default', size: 'lg' }),
                    'bg-gradient-to-tr from-blue-500 to-indigo-400',
                  )}
                >
                  Tiến hành thanh toán
                </Link>
              </div>
            </>
          )}
        </SheetContent>
      </Tooltip>
    </Sheet>
  )
}

function CartIcon({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g clipPath="url(#clip0_1730_25270)">
        <path
          d="M5.33317 14.6668C5.70136 14.6668 5.99984 14.3684 5.99984 14.0002C5.99984 13.632 5.70136 13.3335 5.33317 13.3335C4.96498 13.3335 4.6665 13.632 4.6665 14.0002C4.6665 14.3684 4.96498 14.6668 5.33317 14.6668Z"
          stroke="currentColor"
          strokeWidth="1.33333"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12.6667 14.6668C13.0349 14.6668 13.3333 14.3684 13.3333 14.0002C13.3333 13.632 13.0349 13.3335 12.6667 13.3335C12.2985 13.3335 12 13.632 12 14.0002C12 14.3684 12.2985 14.6668 12.6667 14.6668Z"
          stroke="currentColor"
          strokeWidth="1.33333"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M1.3667 1.36719H2.70003L4.47337 9.64719C4.53842 9.95043 4.70715 10.2215 4.95051 10.4138C5.19387 10.606 5.49664 10.7074 5.8067 10.7005H12.3267C12.6301 10.7 12.9244 10.596 13.1607 10.4057C13.3971 10.2154 13.5615 9.95021 13.6267 9.65385L14.7267 4.70052H3.41337"
          stroke="currentColor"
          strokeWidth="1.33333"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_1730_25270">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  )
}
