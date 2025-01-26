import { faker } from '@faker-js/faker'

const NUM_COLORS = 20
const NUM_MATERIALS = 20

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)

const colors = () =>
  Array.from({ length: NUM_COLORS }).map(() => ({
    title: capitalize(faker.color.human()),
    description: capitalize(faker.commerce.productDescription()),
    hex: faker.color.rgb({ format: 'hex' }),
  }))

const sizes = () =>
  Array.from([
    ['XXXS', 120, 140, 25, 35],
    ['XXS', 130, 150, 35, 45],
    ['XS', 140, 160, 40, 50],
    ['S', 150, 170, 45, 60],
    ['M', 160, 180, 55, 75],
    ['L', 170, 190, 65, 85],
    ['XL', 180, 200, 75, 100],
    ['XXL', 185, 210, 85, 120],
    ['3XL', 190, 220, 100, 150],
    ['4XL', 195, 230, 120, 180],
    ['5XL', 200, 240, 140, 210],
    ['6XL', 205, 250, 160, 240],
    ['7XL', 210, 260, 180, 280],
  ]).map(([name, minHeight, maxHeight, minWeight, maxWeight]) => ({
    name,
    description: `Size ${name}, suitable for height ${minHeight}-${maxHeight}cm and weight ${minWeight}-${maxWeight}kg.`,
    minHeight,
    maxHeight,
    minWeight,
    maxWeight,
  }))

const materials = () =>
  Array.from({ length: NUM_MATERIALS }).map(() => ({
    title: capitalize(faker.commerce.productMaterial()),
    description: capitalize(faker.lorem.sentence({ min: 20, max: 30 })),
  }))

export { colors, sizes, materials }
