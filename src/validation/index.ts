import { z } from 'zod'

export const PayloadUserLoginValidator = z.object({
  email: z.string().email(),
  password: z.string().min(1, {
    message: 'Password must not be blank.',
  }),
})

export const PayloadUserSignUpValidator = z.object({
  email: z.string().email(),
  password: z.string().min(3, {
    message: 'Password must be 3 characters.',
  }),
  name: z.string().min(1, {
    message: 'First name must not be blank.',
  }),
})

export const PayloadUserSettingsValidator = z.object({
  email: z.string().email(),
  password: z.string().optional(),
  name: z.string().min(1, {
    message: 'Name must not be blank.',
  }),
})

export const CreateAddressValidator = z.object({
  name: z.string().min(1, {
    message: 'Name must not be blank.',
  }),
  province: z.string().min(1, {
    message: 'Province must not be blank.',
  }),
  district: z.string().min(1, {
    message: 'District must not be blank.',
  }),
  ward: z.string().min(1, {
    message: 'Ward must not be blank.',
  }),
  contactName: z.string().min(1, {
    message: 'Contact name must not be blank.',
  }),
  contactPhone: z.string().min(1, {
    message: 'Contact phone must not be blank.',
  }),
  detailAddress: z.string().min(1, {
    message: 'Detail address must not be blank.',
  }),
})

export const UserRecommedSizeValidator = z.object({
  height: z.number().min(100),
  weight: z.number().min(20),
})

export const CreateOrderValidator = z.object({
  userId: z.string().min(1, {
    message: 'User must not be blank.',
  }),
  addressId: z.string().min(1, {
    message: 'Please select an address, or create a new one.',
  }),
  lineItems: z.array(
    z.object({
      productVariantId: z.string().min(1, {
        message: 'Product variant must not be blank.',
      }),
      quantityToBuy: z.number().min(1, {
        message: 'Quantity must be greater than 0.',
      }),
    }),
  ),
  couponId: z.string().optional(),
  note: z.string().optional(),
})

export type TCreateOrderValidator = z.infer<typeof CreateOrderValidator>
export type TUserRecommedSizeValidator = z.infer<typeof UserRecommedSizeValidator>
export type TCreateAddressValidator = z.infer<typeof CreateAddressValidator>
export type TPayloadUserLoginValidator = z.infer<typeof PayloadUserLoginValidator>
export type TPayloadUserSignUpValidator = z.infer<typeof PayloadUserSignUpValidator>
export type TPayloadUserSettingsValidator = z.infer<typeof PayloadUserSettingsValidator>
