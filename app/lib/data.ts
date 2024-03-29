import {
  PrismaClient,
  Utilizador,
} from '@prisma/client';

import { formatCurrency, formatDateToLocal } from './utils';

const prisma = new PrismaClient();

export async function fetchAudit() {
  // Add noStore() here prevent the response from being cached.
  // This is equivalent to in fetch(..., {cache: 'no-store'}).

  try {
    // Artificially delay a reponse for demo purposes.
    // Don't do this in real life :)

    console.log('Fetching audit data...');
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const data = await prisma.auditoria.findMany();

    console.log('Data fetch complete after 3 seconds.');

    return data.values() || '1';
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch audit data.');
  }
}

export async function fetchLatestDocuments() {
  try {
    const data = await prisma.documento.findMany({
      select: {
        id: true,
        titulo: true,
        utilizadorId: true,
      },
      orderBy: {
        dataActualizacao: 'desc', // Ordene pela data de atualização em ordem decrescente
      },
      take: 5, // Obtenha os últimos 5 documentos
    });

    const latestDocuments = data;
    return latestDocuments;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest documents.');
  }
}

export async function fetchCardData() {
  try {
    // You can probably combine these into a single SQL query
    // However, we are intentionally splitting them to demonstrate
    // how to initialize multiple queries in parallel with JS.
    const invoiceCountPromise = prisma.documento.findMany();
    const customerCountPromise = prisma.utilizador.findMany();
    const auditoriaCountPromise = prisma.auditoria.findMany();

    const data = await Promise.all([
      invoiceCountPromise,
      customerCountPromise,
      auditoriaCountPromise,
    ]);

    const numberOfDocuments = Number(data[0].length ?? '0');
    const numberOfUsers = Number(data[1].length ?? '0');
    const totalAuditoria = Number(data[2].length ?? '0');
    const totalPendingDocuments = Number(await prisma.documento.count({
      where: {
        status: 'Pendente',
      }
    }) ?? '0');

    return {
      numberOfUsers,
      numberOfDocuments,
      totalAuditoria,
      totalPendingDocuments,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to card data.');
  }
}

const ITEMS_PER_PAGE = 6;
export async function fetchFilteredDocuments(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const data = await prisma.documento.findMany({
      include: {
        Utilizador: {
          select: {
            id: true,
            nome: true,
            Perfil: {
              select: {
                id: true,
                image_url: true
              }
            },
          }
        },
      },
      where: {
        OR: [
          { titulo: { contains: query } },
          { status: { contains: query } },
          { Categoria: { contains: query } },
          { Utilizador: { nome: { contains: query } } },
          { Utilizador: { email: { contains: query } } },
          //{ dataCriacao: { contains: query } },
        ]
      },
      orderBy: { dataCriacao: 'desc' },
      take: ITEMS_PER_PAGE,
      skip: offset,
    });


    const documents = data.map(({ id, titulo, dataCriacao, Categoria, status, Utilizador }) => ({
      id: id,
      titulo: titulo,
      dataCriacao: dataCriacao,
      categoria: Categoria,
      estado: status,

      utilizadorId: Utilizador?.id,
      nome: Utilizador?.nome,
      imagemPerfil: Utilizador?.Perfil?.image_url || '/',
    }))

    return documents;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch documents.');
  }
}

export async function fetchDocumentsPages(query: string) {
  try {
    const count = await prisma.documento.count({
      where: {
        OR: [
          { titulo: { contains: query } },
          // { dataCriacao: query },
          { status: { contains: query } },
          { Categoria: { contains: query } },
          { Utilizador: { nome: { contains: query } } },
          { Utilizador: { email: { contains: query } } },
        ],
      },
    });

    const totalPages = Math.ceil(Number(count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of documents.');
  }
}

export async function fetchDocuments() {
  try {
    const documents = await prisma.documento.findMany({
      orderBy: {
        titulo: 'asc', // Ordene por titulo
      }
    });

    //console.log(documents);
    return documents;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all Documents.');
  }
}

export async function fetchDocumentById(id: string) {
  try {
    const document = await prisma.documento.findUnique({
      include: {
        Utilizador: {
          select: {
            id: true,
            nome: true,
            Perfil: {
              select: {
                id: true,
                image_url: true
              }
            },
          }
        },
        Departamento: {
          select: {
            id: true,
            nome: true,
            descricao: true,
          }
        }
      },
      where: { id: id },
    });

    return document;

  } catch (error) {
    console.error('Database Error:', error);
  }
}

export async function fetchUserById(id: string) {
  try {
    const user = await prisma.utilizador.findUnique({
      where: { id: id },
    });

    //console.log(user);
    return user;

  } catch (error) {
    console.error('Database Error:', error);
  }
}

export async function fetchProfileByUserId(id: string) {
  try {
    const userProfile = await prisma.perfil.findUnique({
      where: { utilizadorId: id },
    });

    //console.log(userProfile);
    return userProfile;

  } catch (error) {
    console.error('Database Error:', error);
  }
}

export async function fetchUsers() {
  try {
    const users = await prisma.utilizador.findMany({
      orderBy: {
        nome: 'asc', // Ordene por nome
      }
    });

    //console.log(users);
    return users;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all Users.');
  }
}

export async function fetchDepartment() {
  try {
    const data = await prisma.departamento.findMany({
      select: {
        id: true,
        nome: true,
        descricao: true,
      }
    });

    const department = data;
    return department;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all departments.');
  }
}

export async function fetchDepartmentById(id: string) {
  try {
    const department = await prisma.departamento.findUnique({
      where: { id: id },
    });

    //console.log(department);
    return department;

  } catch (error) {
    console.error('Database Error:', error);
  }
}

export async function fetchFilteredUsers(query: string) {
  try {
    const data = await prisma.utilizador.findMany({
      where: {
        OR: [
          { nome: { contains: query } },
          { email: { contains: query } },
        ],
      },
      include: {
        documento: {
          select: {
            id: true,
            titulo: true,
            Categoria: true,
            status: true,
            conteudo: true,
          },
        },
        Perfil: {
          select: {
            id: true,
            image_url: true
          }
        }
      },
    });

    const users = data.map((user) => {
      const total_documents = user.documento.length;

      const total_pending = user.documento
        .filter((document) => document.status === 'Pendente')
        .reduce((total, document) => total + document.status.length, 0);

      const total_in_progress = user.documento
        .filter((document) => document.status === 'Em progresso')
        .reduce((total, document) => total + document.status.length, 0);
      
      const total_concluded = user.documento
        .filter((document) => document.status === 'Concluído')
        .reduce((total, document) => total + document.status.length, 0);

      return {
        id: user.id,
        name: user.nome,
        email: user.email,
        image_url: user.Perfil?.image_url, // Use optional chaining to safely access the 'image_url' property
        total_documents,
        total_pending,
        total_in_progress,
        total_concluded,
      };
    });

    return users;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch users table.');
  }
}

export async function getUser(email: string) {
  try {
    const user = await prisma.utilizador.findUnique({
      where: { email: email },
    });

    return user as Utilizador;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}