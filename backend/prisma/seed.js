"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@gameximport.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123!';
    const hashedPassword = await bcryptjs_1.default.hash(adminPassword, 12);
    await prisma.user.upsert({
        where: { email: adminEmail },
        update: {},
        create: {
            nombre: process.env.ADMIN_NAME || 'Administrador Gamex',
            email: adminEmail,
            password: hashedPassword,
            rol: client_1.Role.ADMIN,
        },
    });
    const categoryData = [
        { nombre: 'Laptops', descripcion: 'Computadoras portátiles de última generación' },
        { nombre: 'Smartphones', descripcion: 'Teléfonos inteligentes y accesorios' },
        { nombre: 'Periféricos', descripcion: 'Teclados, mouse, auriculares y más' },
        { nombre: 'Componentes', descripcion: 'Procesadores, RAM, SSD y tarjetas gráficas' },
    ];
    const categories = [];
    for (const cat of categoryData) {
        const category = await prisma.category.upsert({
            where: { nombre: cat.nombre },
            update: {},
            create: cat,
        });
        categories.push(category);
    }
    const products = [
        { nombre: 'Laptop HP Pavilion 15', descripcion: 'Intel Core i5, 8GB RAM, 512GB SSD', precio: 2499.99, imagen: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400', categoryId: categories[0].id, stock: 15 },
        { nombre: 'MacBook Air M2', descripcion: 'Apple M2, 8GB RAM, 256GB SSD', precio: 4999.99, imagen: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400', categoryId: categories[0].id, stock: 8 },
        { nombre: 'Samsung Galaxy S24', descripcion: '256GB, cámara 50MP, pantalla AMOLED', precio: 3299.99, imagen: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400', categoryId: categories[1].id, stock: 20 },
        { nombre: 'iPhone 15 Pro', descripcion: '256GB, Titanio, cámara Pro', precio: 4599.99, imagen: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400', categoryId: categories[1].id, stock: 12 },
        { nombre: 'Teclado Mecánico RGB', descripcion: 'Switches Red, retroiluminación RGB', precio: 189.99, imagen: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400', categoryId: categories[2].id, stock: 50 },
        { nombre: 'Mouse Logitech G502', descripcion: 'Gaming, 11 botones programables', precio: 249.99, imagen: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400', categoryId: categories[2].id, stock: 35 },
        { nombre: 'SSD Samsung 1TB NVMe', descripcion: 'Lectura 3500MB/s, PCIe 4.0', precio: 399.99, imagen: 'https://images.unsplash.com/photo-1597872200969-2b65d56aadae?w=400', categoryId: categories[3].id, stock: 40 },
        { nombre: 'RTX 4070 Super', descripcion: '12GB GDDR6X, Ray Tracing', precio: 2899.99, imagen: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400', categoryId: categories[3].id, stock: 5 },
    ];
    for (const product of products) {
        const { stock, ...productData } = product;
        const existing = await prisma.product.findFirst({ where: { nombre: product.nombre } });
        const created = existing
            ? await prisma.product.update({ where: { id: existing.id }, data: productData })
            : await prisma.product.create({ data: productData });
        await prisma.inventory.upsert({
            where: { productId: created.id },
            update: { stock },
            create: { productId: created.id, stock },
        });
    }
    console.log('Seed completado exitosamente');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map