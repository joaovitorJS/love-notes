import { v } from 'convex/values'

import {
  mutation,
  query,
  type MutationCtx,
  type QueryCtx,
} from './_generated/server'
import type { Doc, Id } from './_generated/dataModel'

type GenericCtx = MutationCtx | QueryCtx

async function getUserId(ctx: GenericCtx) {
  const identity = await ctx.auth.getUserIdentity()

  if (!identity) {
    throw new Error('Not authenticated')
  }

  const userId = identity.subject

  return userId
}

async function getExistingDocument(ctx: GenericCtx, id: Id<'documents'>) {
  const existingDocument = await ctx.db.get(id)

  if (!existingDocument) {
    throw new Error('Not found document')
  }

  return existingDocument
}

export const archive = mutation({
  args: { id: v.id('documents') },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx)

    const existingDocument = await getExistingDocument(ctx, args.id)

    if (existingDocument.userId !== userId) {
      throw new Error('Unauthorized')
    }

    const recursiveArchive = async (documentId: Id<'documents'>) => {
      const children = await ctx.db
        .query('documents')
        .withIndex('by_user_parent', q =>
          q.eq('userId', userId).eq('parentDocument', documentId)
        )
        .collect()

      for (const child of children) {
        await ctx.db.patch(child._id, {
          isArchived: true,
        })

        await recursiveArchive(child._id)
      }
    }

    const document = await ctx.db.patch(args.id, {
      isArchived: true,
    })

    recursiveArchive(args.id)

    return document
  },
})

export const getSidebar = query({
  args: {
    parentDocument: v.optional(v.id('documents')),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx)

    const documents = await ctx.db
      .query('documents')
      .withIndex('by_user_parent', q =>
        q.eq('userId', userId).eq('parentDocument', args.parentDocument)
      )
      .filter(q => q.eq(q.field('isArchived'), false))
      .order('desc')
      .collect()

    return documents
  },
})

export const create = mutation({
  args: {
    title: v.string(),
    parentDocument: v.optional(v.id('documents')),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx)

    const document = await ctx.db.insert('documents', {
      title: args.title,
      parentDocument: args.parentDocument,
      userId,
      isArchived: false,
      isPublished: false,
    })

    return document
  },
})

export const getTrash = query({
  handler: async ctx => {
    const userId = await getUserId(ctx)

    const documents = await ctx.db
      .query('documents')
      .withIndex('by_user', q => q.eq('userId', userId))
      .filter(q => q.eq(q.field('isArchived'), true))
      .order('desc')
      .collect()

    return documents
  },
})

export const restore = mutation({
  args: { id: v.id('documents') },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx)

    const existingDocument = await getExistingDocument(ctx, args.id)

    if (existingDocument.userId !== userId) {
      throw new Error('Unauthorized')
    }

    const recursiveRestore = async (documentId: Id<'documents'>) => {
      const children = await ctx.db
        .query('documents')
        .withIndex('by_user_parent', q =>
          q.eq('userId', userId).eq('parentDocument', documentId)
        )
        .collect()

      for (const child of children) {
        await ctx.db.patch(child._id, {
          isArchived: false,
        })

        await recursiveRestore(child._id)
      }
    }

    const options: Partial<Doc<'documents'>> = {
      isArchived: false,
    }

    if (existingDocument.parentDocument) {
      const parent = await ctx.db.get(existingDocument.parentDocument)

      if (parent?.isArchived) {
        options.parentDocument = undefined
      }
    }

    const document = await ctx.db.patch(args.id, options)

    recursiveRestore(args.id)

    return document
  },
})

export const remove = mutation({
  args: { id: v.id('documents') },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx)

    const existingDocument = await getExistingDocument(ctx, args.id)

    if (existingDocument.userId !== userId) {
      throw new Error('Unauthorized')
    }

    const document = await ctx.db.delete(args.id)

    return document
  },
})
