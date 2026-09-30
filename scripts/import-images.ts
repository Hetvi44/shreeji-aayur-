import fs from 'fs'
import path from 'path'
import AdmZip from 'adm-zip'
import { PrismaClient } from '@prisma/client'

async function main() {
  const zipPath = process.argv[2] || path.join(process.cwd(), 'shreejiaayur-full.zip')
  if (!fs.existsSync(zipPath)) {
    console.error('Zip not found:', zipPath)
    process.exit(1)
  }

  const extractDir = path.join(process.cwd(), 'public', 'uploads', 'products')
  fs.mkdirSync(extractDir, { recursive: true })

  console.log('Extracting', zipPath, 'to', extractDir)
  const zip = new AdmZip(zipPath)
  zip.extractAllTo(extractDir, true)

  function walkDir(dir: string): string[] {
    let results: string[] = []
    const list = fs.readdirSync(dir)
    for (const file of list) {
      const full = path.join(dir, file)
      const stat = fs.statSync(full)
      if (stat && stat.isDirectory()) results = results.concat(walkDir(full))
      else results.push(full)
    }
    return results
  }

  const allFiles = walkDir(extractDir).filter((f) => /\.(jpe?g|png)$/i.test(f))
  if (allFiles.length === 0) {
    console.warn('No image files found in', extractDir)
    process.exit(0)
  }

  // Flatten nested files into extractDir root
  const files: string[] = []
  for (const fullpath of allFiles) {
    const destName = path.basename(fullpath)
    const destPath = path.join(extractDir, destName)
    if (fullpath !== destPath) {
      fs.copyFileSync(fullpath, destPath)
    }
    files.push(destName)
  }

  const prisma = new PrismaClient()
  try {
    for (const file of files) {
      const slug = path.basename(file, path.extname(file))
      const url = `/uploads/products/${file}`

      const product = await prisma.product.findUnique({ where: { slug } })
      if (!product) {
        console.warn(`No product found for slug: ${slug} (file: ${file})`)
        continue
      }

      await prisma.product.update({ where: { id: product.id }, data: { images: [url] } })
      console.log(`Updated product ${slug} with image ${url}`)
    }
  } catch (err) {
    console.error('Import error', err)
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .then(() => console.log('Done'))
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
