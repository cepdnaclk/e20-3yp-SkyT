import { RequestHandler, Response } from "express";

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

const data = [
  { value: "27°C" },
  { value: "45%" },
  { value: "6.5" },
  { value: "10 mg/L" },
  { value: "12 mg/L" },
  { value: "8 mg/L" },
];

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

export const getData: RequestHandler = async (req, res, next) => {
  try {
    const query = data;
    console.log("Sensor readings got successfully!", query);
    res.status(200).json(query);
  } catch (error) {
    next(error);
  }
};

export const deleteData: RequestHandler = async (req, res, next) => {
  try {
    // Destructuring object
    const id = req.body._id;
    //console.log(`Delete Event id: ${id}`);

    console.log("Event deleted successfully!");
    res.status(200).json("success");
  } catch (error) {
    next(error);
  }
};
