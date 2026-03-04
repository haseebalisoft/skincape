import swaggerJsdoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'SkinScape PK API',
            version: '1.0.0',
            description: 'API Documentation for SkinScape PK Aesthetic Clinic',
            contact: {
                name: 'SkinScape PK',
                email: 'info@skinscapepk.com',
            },
        },
        servers: [
            {
                url: 'http://localhost:5000/api',
                description: 'Development Server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
            schemas: {
                User: {
                    type: 'object',
                    required: ['email', 'password', 'name'],
                    properties: {
                        id: { type: 'string', description: 'The auto-generated id of the user' },
                        name: { type: 'string' },
                        email: { type: 'string', format: 'email' },
                        role: { type: 'string', enum: ['admin', 'staff'], default: 'staff' },
                        isActive: { type: 'boolean', default: true },
                        createdAt: { type: 'string', format: 'date-time' },
                    },
                },
                Service: {
                    type: 'object',
                    required: ['title', 'description', 'details'],
                    properties: {
                        id: { type: 'string', description: 'The auto-generated id of the service' },
                        title: { type: 'string' },
                        description: { type: 'string' },
                        icon: { type: 'string', default: 'Sparkles' },
                        details: {
                            type: 'object',
                            properties: {
                                what: { type: 'string' },
                                whoFor: { type: 'string' },
                                recovery: { type: 'string' },
                                results: { type: 'string' },
                            },
                        },
                        price: { type: 'number', minimum: 0 },
                        duration: { type: 'string' },
                        isActive: { type: 'boolean', default: true },
                        order: { type: 'number', default: 0 },
                    },
                },
                Appointment: {
                    type: 'object',
                    required: ['name', 'phone', 'treatment', 'date', 'time'],
                    properties: {
                        id: { type: 'string', description: 'The auto-generated id of the appointment' },
                        name: { type: 'string' },
                        phone: { type: 'string' },
                        treatment: { type: 'string' },
                        date: { type: 'string', format: 'date' },
                        time: { type: 'string' },
                        concern: { type: 'string' },
                        status: { type: 'string', enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending' },
                        notes: { type: 'string' },
                        createdAt: { type: 'string', format: 'date-time' },
                    },
                },
                Testimonial: {
                    type: 'object',
                    required: ['name', 'message'],
                    properties: {
                        id: { type: 'string', description: 'The auto-generated id of the testimonial' },
                        name: { type: 'string' },
                        role: { type: 'string' },
                        message: { type: 'string' },
                        rating: { type: 'number', minimum: 1, maximum: 5 },
                        image: { type: 'string' },
                        isApproved: { type: 'boolean', default: false },
                        isFeatured: { type: 'boolean', default: false },
                        createdAt: { type: 'string', format: 'date-time' },
                    },
                },
            },
        },
    },
    apis: ['./routes/*.js'], // Path to the API docs
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
