'use server'

import { getPayloadClient } from '@/get-payload'
import { getServerSideUser } from '@/get-serverside-user'
import { Address } from '@/payload-types'
import { CreateAddressValidator, TCreateAddressValidator } from '@/validation'
import { revalidatePath } from 'next/cache'

export const getAddresses = async () => {
  const client = await getPayloadClient()

  const { user: currentUser } = await getServerSideUser()

  if (!currentUser || !client) {
    return { success: false, message: 'Unauthorized' }
  }

  const { docs: addresses } = await client.find({
    collection: 'addresses',
    pagination: false,
    where: {
      user: {
        equals: currentUser.id,
      },
    },
  })

  return { success: true, data: addresses }
}

export const createAddress = async (values: TCreateAddressValidator) => {
  const client = await getPayloadClient()
  const { user: currentUser } = await getServerSideUser()

  if (!currentUser || !client) {
    return { success: false, message: 'Unauthorized' }
  }

  const { data, error } = CreateAddressValidator.safeParse(values)

  if (error) {
    return { success: false, message: error.message }
  }

  const { name, contactName, contactPhone, province, district, ward, detailAddress } =
    data as Address

  const { totalDocs: numOfAddresses } = await client.find({
    collection: 'addresses',
    pagination: false,
    where: {
      user: {
        equals: currentUser.id,
      },
    },
  })

  if (numOfAddresses >= 5) {
    return { success: false, message: 'You can only have up to 5 addresses' }
  }

  const address = await client.create({
    collection: 'addresses',
    data: {
      name,
      contactName,
      contactPhone,
      province,
      district,
      ward,
      detailAddress,
      user: currentUser.id,
    },
  })

  if (address) {
    revalidatePath('/account')
    return { success: true, message: 'Address has been created' }
  }

  return { success: false, message: 'Failed to create address' }
}

export const deleteAddress = async (addressId: string) => {
  const client = await getPayloadClient()
  const { user: currentUser } = await getServerSideUser()

  if (!currentUser || !client) {
    return { success: false, message: 'Unauthorized' }
  }

  const address = await client.delete({
    collection: 'addresses',
    id: addressId,
  })

  if (address) {
    revalidatePath('/account')
    return { success: true, message: 'Address has been deleted' }
  }

  return { success: false, message: 'Failed to delete address' }
}
