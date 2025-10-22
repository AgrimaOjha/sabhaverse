const prisma = require('../utils/prisma');

// Get all debates with pagination
exports.getAllDebates = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, sortBy = 'createdAt', order = 'desc' } = req.query;
    const skip = (page - 1) * parseInt(limit);
    
    const where = category ? { category } : {};
    
    const debates = await prisma.debate.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            profileImage: true
          }
        },
        _count: {
          select: { replies: true }
        }
      },
      orderBy: {
        [sortBy]: order
      },
      skip,
      take: parseInt(limit)
    });
    
    const total = await prisma.debate.count({ where });
    
    res.json({
      debates,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page)
    });
  } catch (error) {
    console.error('Get all debates error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get debate by ID
exports.getDebateById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const debate = await prisma.debate.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            profileImage: true,
            reputation: true
          }
        },
        replies: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                profileImage: true
              }
            }
          },
          orderBy: {
            createdAt: 'asc'
          }
        }
      }
    });
    
    if (!debate) {
      return res.status(404).json({ message: 'Debate not found' });
    }
    
    res.json(debate);
  } catch (error) {
    console.error('Get debate by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new debate
exports.createDebate = async (req, res) => {
  try {
    const { title, description, category, imageUrl } = req.body;
    const authorId = req.user.id;
    
    const debate = await prisma.debate.create({
      data: {
        title,
        description,
        category,
        imageUrl,
        author: {
          connect: { id: authorId }
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
    
    res.status(201).json(debate);
  } catch (error) {
    console.error('Create debate error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a debate
exports.updateDebate = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category, imageUrl } = req.body;
    const userId = req.user.id;
    
    // Check if debate exists and belongs to user
    const existingDebate = await prisma.debate.findUnique({
      where: { id },
      select: { authorId: true }
    });
    
    if (!existingDebate) {
      return res.status(404).json({ message: 'Debate not found' });
    }
    
    if (existingDebate.authorId !== userId) {
      return res.status(403).json({ message: 'Not authorized to update this debate' });
    }
    
    const updatedDebate = await prisma.debate.update({
      where: { id },
      data: {
        title,
        description,
        category,
        imageUrl
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
    
    res.json(updatedDebate);
  } catch (error) {
    console.error('Update debate error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a debate
exports.deleteDebate = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    // Check if debate exists and belongs to user
    const existingDebate = await prisma.debate.findUnique({
      where: { id },
      select: { authorId: true }
    });
    
    if (!existingDebate) {
      return res.status(404).json({ message: 'Debate not found' });
    }
    
    if (existingDebate.authorId !== userId) {
      return res.status(403).json({ message: 'Not authorized to delete this debate' });
    }
    
    // Delete all replies first
    await prisma.debateReply.deleteMany({
      where: { debateId: id }
    });
    
    // Delete the debate
    await prisma.debate.delete({
      where: { id }
    });
    
    res.json({ message: 'Debate deleted successfully' });
  } catch (error) {
    console.error('Delete debate error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add a reply to a debate
exports.addReply = async (req, res) => {
  try {
    const { debateId } = req.params;
    const { content, role } = req.body;
    const authorId = req.user.id;
    
    // Check if debate exists
    const debate = await prisma.debate.findUnique({
      where: { id: debateId }
    });
    
    if (!debate) {
      return res.status(404).json({ message: 'Debate not found' });
    }
    
    const reply = await prisma.debateReply.create({
      data: {
        content,
        role,
        author: {
          connect: { id: authorId }
        },
        debate: {
          connect: { id: debateId }
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
    
    res.status(201).json(reply);
  } catch (error) {
    console.error('Add reply error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Upvote a debate
exports.upvoteDebate = async (req, res) => {
  try {
    const { id } = req.params;
    
    const debate = await prisma.debate.findUnique({
      where: { id },
      select: { upvotes: true, authorId: true }
    });
    
    if (!debate) {
      return res.status(404).json({ message: 'Debate not found' });
    }
    
    const updatedDebate = await prisma.debate.update({
      where: { id },
      data: {
        upvotes: debate.upvotes + 1
      }
    });
    
    // Increase author's reputation
    await prisma.user.update({
      where: { id: debate.authorId },
      data: {
        reputation: {
          increment: 2
        }
      }
    });
    
    res.json(updatedDebate);
  } catch (error) {
    console.error('Upvote debate error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};