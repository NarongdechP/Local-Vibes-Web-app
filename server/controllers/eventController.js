import { validationResult } from "express-validator";
import sanitizeHtml from "sanitize-html";
import mongoose from "mongoose";
import Event from "../models/Event.js";

export const createEvent = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error("Validation errors:", errors.array());
    return res.status(400).json({ errors: errors.array() });
  }

  let { event_name, description, start_date, end_date, location, category, event_image_url } = req.body;
  const userId = req.user.id;

  event_name = sanitizeHtml(event_name);
  description = description ? sanitizeHtml(description) : null;
  location = location ? sanitizeHtml(location) : null;
  category = category ? sanitizeHtml(category) : null;
  event_image_url = event_image_url ? sanitizeHtml(event_image_url) : null;

  try {
    const newEvent = new Event({
      event_name,
      description,
      start_date,
      end_date,
      location,
      category,
      event_image_url,
      created_by: userId,
    });

    await newEvent.save();
    res.status(201).json({ message: "สร้างอีเวนต์สำเร็จ", event: newEvent });
  } catch (err) {
    console.error("🔴 Event Creation Error:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการสร้างอีเวนต์" });
  }
};

export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json({ events });
  } catch (err) {
    console.error("🔴 Error fetching events:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const searchEvents = async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: "กรุณากรอกคำค้นหา" });
  }

  try {
    const events = await Event.find({
      event_name: { $regex: query, $options: "i" },
    });
    res.status(200).json({ events });
  } catch (err) {
    console.error("🔴 Error searching events:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getEventById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "ID ไม่ถูกต้อง" });
  }

  try {
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: "ไม่พบข้อมูลอีเวนต์นี้" });
    }
    res.status(200).json({ event });
  } catch (err) {
    console.error("🔴 Error fetching event:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ error: 'ไม่พบกิจกรรมนี้' });
    }

    res.status(200).json({ event });
  } catch (err) {
    console.error('Error fetching event:', err);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูลกิจกรรม' });
  }
};
