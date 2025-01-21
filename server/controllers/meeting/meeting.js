const MeetingHistory = require('../../model/schema/meeting')
const mongoose = require('mongoose');

const add = async (req, res) => {
    try {
        const { agenda, attendes, attendesLead, location, related, dateTime, notes, createBy } = req.body;
        const newMeeting = new MeetingHistory({
            agenda,
            attendes,
            attendesLead,
            location,
            related,
            dateTime,
            notes,
            createBy,
        });

        
        const savedMeeting = await newMeeting.save();

        return res.status(201).send({
            success: true,
            message: 'Meeting created successfully',
            data: savedMeeting,
        });
    } catch (error) {
        console.log('Error creating meeting:', error);
        return res.status(500).send({
            success: false,
            message: 'Internal Server Error',
            error: error
        });
    }
}

const index = async (req, res) => {
    try {
        
        const meetings = await MeetingHistory.find({ deleted: false })
          .populate('createBy');     
    
        return res.status(200).send({
          success: true,
          data: meetings,
        });
      } catch (error) {
        console.log('Error fetching meetings:', error);
        return res.status(500).send({
          success: false,
          message: 'Internal Server Error',
          error: error,
        });
      }
}

const view = async (req, res) => {
    try {
        const { id } = req.params;
    
        
        const meeting = await MeetingHistory.findOne({ _id: id, deleted: false })
          .populate('createBy');
    
        if (!meeting) {
          return res.status(404).send({
            success: false,
            message: 'Meeting not found or has been deleted',
          });
        }
    
        return res.status(200).send({
          success: true,
          data: meeting,
        });
      } catch (error) {
        console.error('Error fetching the meeting:', error);
        return res.status(500).send({
          success: false,
          message: 'Internal Server Error',
        });
      }
}

const deleteData = async (req, res) => {
    try {
        const { id } = req.params;
    
       
        const deletedMeeting = await MeetingHistory.findByIdAndUpdate(
          id,
          { deleted: true },
          { new: true }
        );
    
        if (!deletedMeeting) {
          return res.status(404).send({
            success: false,
            message: 'Meeting not found',
          });
        }
    
        return res.status(200).send({
          success: true,
          message: 'Meeting deleted successfully',
          data: deletedMeeting,
        });
      } catch (error) {
        console.error('Error deleting meeting:', error);
        return res.status(500).send({
          success: false,
          message: 'Internal Server Error',
          error: error,
        });
      }
}

const deleteMany = async (req, res) => {
    try {
         
        const result = await MeetingHistory.updateMany(
          { _id: { $in: req.body } },
          { $set: { deleted: true } }
        );
    
        return res.status(200).send({
          success: true,
          message: 'Meetings deleted successfully',
          data: result,
        });
      } catch (error) {
        console.error('Error deleting multiple meetings:', error);
        return res.status(500).send({
          success: false,
          message: 'Internal Server Error',
        });
      }
}

module.exports = { add, index, view, deleteData, deleteMany }