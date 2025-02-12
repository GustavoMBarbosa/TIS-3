import express from 'express'
import *  as notificationController from '../controller/notificationController.js'

const router = express.Router()

router.get("/list", notificationController.getAllNotifications)
router.get("/:animal_id/:title", notificationController.getNotification)
router.post("/", notificationController.createNewNotification)
router.put("/:id", notificationController.updateNotification)
router.delete("/:id", notificationController.deleteNotificationById)

export default router