import { RequestHandler, Response } from "express";
import GalleryModel from "../models/Gallery";

interface Image {
  image: String;
  title: String;
}

interface Props {
  event: string;
  note: string;
  images: Image[];
  res: Response;
}

function handleEvent({ event, note, images, res }: Props) {
  //console.log(`New event: ${event}\n ${note}\n ${JSON.stringify(images)}`);

  // Check if the necessary fields are provided
  if (!event || !note || images.length < 1) {
    console.log("Less event data");
    return res
      .status(400)
      .json({ message: "All fields are required in event" });
  }

  // Loop through the images and validate each one
  for (const item of images) {
    if (!item.title || !item.image) {
      console.log("less image data");
      return res
        .status(400)
        .json({ message: "Each image must have a title and image URL." });
    }
  }

  // Create a new event
  const newImages = images.map((image: Image) => ({
    title: image.title,
    image: image.image,
  }));

  console.log(newImages);

  return { event, note, images: newImages };
}

export const createEvent: RequestHandler = async (req, res, next) => {
  try {
    const { event, note, images } = req.body;
    //console.log(`New event: ${event}\n ${note}\n ${JSON.stringify(images)}`);

    // Dubugging Event and create new.
    const createdEvent = await GalleryModel.create(
      handleEvent({ event, note, images, res })
    );

    // Respond with the created gallery entry
    res.status(201).json("succes");
    console.log("Event created successfully!");
  } catch (error) {
    next(error);
  }
};

export const getEvents: RequestHandler = async (req, res, next) => {
  try {
    const query = await GalleryModel.find();
    console.log("Events got successfully!");
    res.status(200).json(query);
  } catch (error) {
    next(error);
  }
};

export const updateEvent: RequestHandler = async (req, res, next) => {
  try {
    // Destructuring object
    const { _id, event, note, images } = req.body;
    /* console.log(
      `Update id: ${_id} \n${event}\n ${note}\n ${JSON.stringify(images)}}`
    ); */

    // Error handling and updating according to the id
    const updatedEvent = await GalleryModel.findByIdAndUpdate(
      _id,
      handleEvent({ event, note, images, res }),
      {
        new: true,
      }
    );

    if (!updatedEvent) {
      console.log("Event not found!");
      return res.status(404).json({ message: "Event not found" });
    }

    console.log("Event updated successfully!");
    res.status(200).json("success");
  } catch (error) {
    next(error);
  }
};

export const deleteEvent: RequestHandler = async (req, res, next) => {
  try {
    // Destructuring object
    const id = req.body._id;
    //console.log(`Delete Event id: ${id}`);

    // Use the _id to find the event and delete the relevant data
    const deletedEvent = await GalleryModel.findByIdAndDelete(id);

    if (!deletedEvent) {
      console.log("Event not found!");
      return res.status(404).json({ message: "Event not found" });
    }

    console.log("Event deleted successfully!");
    res.status(200).json("success");
  } catch (error) {
    next(error);
  }
};
