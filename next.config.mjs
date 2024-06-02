/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
              protocol: 'https',
              hostname: 'res.cloudinary.com', // Reemplaza con el dominio de tu proveedor de imágenes
              pathname: '/**', // Reemplaza con el patrón de URL adecuado si es necesario
            },
          ],
      },
};

export default nextConfig;
