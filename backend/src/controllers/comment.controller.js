const prisma = require('../utils/prisma');

// Create a comment
exports.createComment = async (req, res) => {
  try {
    const { postId, content } = req.body;
    const authorId = req.user.id;
    
    const comment = await prisma.comment.create({
      data: {
        content,
        author: {
          connect: { id: authorId }
        },
        post: {
          connect: { id: postId }
        }
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            profileImage: true
          }
        }
      }
    });
    
    res.status(201).json(comment);
  } catch (error) {
    console.error('Create comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a comment
exports.updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user.id;
    

    const existingComment = await prisma.comment.findUnique({
      where: { id },
      select: { authorId: true }
    });
    
    if (!existingComment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    if (existingComment.authorId !== userId) {
      return res.status(403).json({ message: 'Not authorized to update this comment' });
    }
    
    const updatedComment = await prisma.comment.update({
      where: { id },
      data: { content },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            profileImage: true
          }
        }
      }
    });
    
    res.json(updatedComment);
  } catch (error) {
    console.error('Update comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a comment
exports.deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    

    const existingComment = await prisma.comment.findUnique({
      where: { id },
      select: { authorId: true }
    });
    
    if (!existingComment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    if (existingComment.authorId !== userId) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }
    
    await prisma.comment.delete({
      where: { id }
    });
    
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Upvote a comment
exports.upvoteComment = async (req, res) => {
  try {
    const { id } = req.params;
    
    const comment = await prisma.comment.findUnique({
      where: { id },
      select: { upvotes: true, authorId: true }
    });
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    const updatedComment = await prisma.comment.update({
      where: { id },
      data: {
        upvotes: comment.upvotes + 1
      }
    });
    

    await prisma.user.update({
      where: { id: comment.authorId },
      data: {
        reputation: {
          increment: 1
        }
      }
    });
    
    res.json(updatedComment);
  } catch (error) {
    console.error('Upvote comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};