# Product Images Setup

## Generated AI Images

The following AI-generated images have been created for the demo products:

- `smartphone_gadget.png` - For smartphone products
- `laptop_device.png` - For laptop products
- `wireless_headphones.png` - For headphone products
- `smartwatch_wearable.png` - For smartwatch products
- `tech_accessories.png` - For accessory products

## Setup Instructions

These images need to be copied to `client/public/assets/products/` directory.

You can either:

1. **Manual Copy**: Copy the generated images from the artifacts folder to:
   ```
   client/public/assets/products/
   ```

2. **Use Placeholders**: The application will use placeholder gradients if images fail to load, so you can run the application without copying images first.

3. **Replace with Real Images**: You can replace these with actual product images by:
   - Downloading real product images
   - Saving them in `client/public/assets/products/`
   - Following the naming convention from the seed file

## Image Paths in Database

The seed file (`server/prisma/seed.ts`) references these image paths:
- `/assets/products/iphone-15-pro.jpg`
- `/assets/products/samsung-s24.jpg`
- `/assets/products/pixel-8-pro.jpg`
- etc.

You can either:
- Rename the generated images to match these names
- Update the seed file to use different names
- Use the fallback placeholder system (default behavior)
