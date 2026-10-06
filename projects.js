/*
  PROJECTS — ordered for a hiring-manager skim (mixes AI, race car, robotics, manufacturing).

  Fields
    categories : "robotics" | "software-ai" | "manufacturing"  (drives the filter chips)
    status     : optional badge on the card, e.g. "In progress"
    result     : optional one-line outcome, shown in the project popup
    links      : optional [{ label, url }] (GitHub, demo video, report PDF) shown in the popup
    videos     : optional [{ src, title, poster }] shown at the top of the popup.
                 src can be an .mp4 in your assets folder (e.g. "assets/projects/neuro-drone/flight1.mp4")
                 or a YouTube link (unlisted works great for big files).
                 poster is an optional preview image for .mp4 files.

  Images that don't exist yet are skipped automatically, so you can add screenshots
  to the folders below whenever you're ready.
*/
const PROJECTS = [
  {
    slug: "gaucho-racing",
    title: "Gaucho Racing",
    subtitle: "Formula SAE · Powertrain & Drivetrain",
    categories: ["manufacturing"],
    status: "Ongoing",
    heroImage: "assets/projects/gaucho-racing/GauchoRacingMainView.png",
    gallery: [
      "assets/projects/gaucho-racing/GauchoRacingMainView.png",
      "assets/projects/gaucho-racing/GauchoRacing2.png",
      "assets/projects/gaucho-racing/GauchoRacing3.png",
      "assets/projects/gaucho-racing/GauchoRacing4.png",
    ],
    skills: ["SolidWorks", "FEA", "GD&T", "Drivetrain", "Powertrain"],
    description:
      "Powertrain and drivetrain work on UCSB's Formula SAE car. Engineered a custom tractive battery container for the inverter, e-tray, and 5 battery modules, and validated drivetrain mounting brackets with iterative FEA.",
    result: "Drivetrain brackets hold a 1.5 safety factor and are 15% lighter.",
    links: [],
  },
  {
    slug: "silver",
    title: "Silver Bot",
    subtitle: "VEX U Competition Robot",
    categories: ["robotics"],
    heroImage: "assets/projects/silver/SilverMainView.png",
    gallery: [
      "assets/projects/silver/SilverMainView.png",
      "assets/projects/silver/SilverRenderedView.png",
      "assets/projects/silver/SilverSideView.png",
      "assets/projects/silver/SilverSideView2.png",
    ],
    skills: ["Fusion 360", "Drivetrain Design", "Prototyping", "Robotics"],
    description:
      "A 24-inch VEX U robot with an 8-motor, 6-wheel drivetrain for strong traction and a parking gap. Includes a prototyped match loader, a battery clip for faster swaps, and an extended de-score hook that clears long-goal blocks.",
    links: [],
  },
  {
    slug: "sonic",
    title: "Sonic Bot",
    subtitle: "VEX U Competition Robot",
    categories: ["robotics"],
    heroImage: "assets/projects/sonic/SonicMainView.png",
    gallery: [
      "assets/projects/sonic/SonicMainView.png",
      "assets/projects/sonic/SonicFrontView.png",
      "assets/projects/sonic/SonicIntakeView.png",
      "assets/projects/sonic/SonicRenderedView.png",
      "assets/projects/sonic/SonicSideView.png",
    ],
    skills: ["Fusion 360", "Drivetrain Design", "Robotics"],
    description:
      "A 15-inch VEX U robot for the Push Back season. Its 4-wheel, 8-motor drivetrain fits the tight size limit, with the intake, match loader, and aligners modeled in Fusion 360.",
    links: [],
  },
  {
    slug: "neuro-drone",
    title: "Neuro Drone",
    subtitle: "EMG-Controlled Drone · Neurotech",
    categories: ["robotics", "software-ai"],
    status: "Ongoing",
    heroImage: "assets/projects/neuro-drone/NeuroDroneMainView.png",
    gallery: [
      "assets/projects/neuro-drone/NeuroDroneMainView.png",
      "assets/projects/neuro-drone/NeuroDrone2.png",
      "assets/projects/neuro-drone/NeuroDrone3.png",
      "assets/projects/neuro-drone/NeuroDrone4.png",
    ],
    skills: ["CAD", "3D Printing", "EMG Sensing", "Arduino", "ESP32"],
    // Add videos here, e.g.:
    // videos: [{ title: "First flight test", src: "assets/projects/neuro-drone/flight1.mp4" }],
    videos: [],
    description:
      "A drone being built to fly on muscle signals. I independently designed the airframe from concept to a finished CAD assembly: chassis, arms, ducted prop guards, and landing legs, 3D printed and kept rigid to minimize vibration in the EMG measurements. I also collect EMG data and help build the control system.",
    result: "Mounts and housings held components securely through 20+ test flights.",
    links: [],
  },
  {
    slug: "robotic-hand",
    title: "Robotic Hand",
    subtitle: "Cable-Driven Hand",
    categories: ["robotics"],
    status: "In progress",
    heroImage: "assets/projects/robotic-hand/RoboticHandMainView.png",
    gallery: [
      "assets/projects/robotic-hand/RoboticHandMainView.png",
      "assets/projects/robotic-hand/RoboticHand2.png",
      "assets/projects/robotic-hand/RoboticHand3.png",
      "assets/projects/robotic-hand/RoboticHand4.png",
    ],
    skills: ["SolidWorks", "3D Printing", "Servo Motors", "Mechanical Design"],
    description:
      "A cable-driven robotic hand prototype that grasps objects up to 2 lbs using a cable-tendon system driven by 5 servo motors. Finger joint geometry was iterated across multiple CAD revisions to maximize range of motion and eliminate mechanical binding.",
    result: "100% actuation success rate in testing; grips objects up to 2 lbs.",
    links: [],
  },
  {
    slug: "smartbins",
    title: "SmartBins",
    subtitle: "Automated Waste Sorting System",
    categories: ["robotics"],
    heroImage: "assets/projects/smartbins/SmartBinsMainView.png",
    gallery: [
      "assets/projects/smartbins/SmartBinsMainView.png",
      "assets/projects/smartbins/SmartBinsDashboardView.png",
      "assets/projects/smartbins/SmartBinsCodeandDashboardView.png",
      "assets/projects/smartbins/SmartBinsInsertTrashView.png",
    ],
    skills: ["Computer Vision", "OpenCV", "Machine Learning", "Arduino", "Raspberry Pi", "SolidWorks", "HTML/CSS"],
    description:
      "An automated waste separation system that uses computer vision (OpenCV and machine learning) with 6 servo motors and 4 ultrasonic sensors to categorize recyclables and landfill materials. Microcontrollers apply Hooke's Law for dynamic mass estimation, and the system was prototyped, assembled, and validated in a 36-hour hackathon.",
    result: "95% sorting success rate, with inputs processed in under 2 seconds.",
    links: [],
  },
  {
    slug: "compressed-air-motor",
    title: "Compressed Air Motor",
    subtitle: "Machining & Manufacturing Project",
    categories: ["manufacturing"],
    heroImage: "assets/projects/compressed-air-motor/CompressedAirMotorFrontView.png",
    gallery: [
      "assets/projects/compressed-air-motor/CompressedAirMotorFrontView.png",
      "assets/projects/compressed-air-motor/CompressedAirMotorSideView.png",
      "assets/projects/compressed-air-motor/CompressedAirMotorTopView.png",
    ],
    skills: ["Machining", "Lathe", "Mill", "Manufacturing", "Mechanical Design"],
    description:
      "A compressed air engine machined from raw aluminum and brass using manual manufacturing processes and precision tolerancing.",
    result: "Parts machined to ±0.005 in tolerances.",
    links: [],
  },
  {
    slug: "traverse",
    title: "Traverse",
    subtitle: "Rail-Mounted Camera System",
    categories: ["robotics"],
    heroImage: "assets/projects/traverse/TraverseMainView.png",
    gallery: [
      "assets/projects/traverse/TraverseMainView.png",
      "assets/projects/traverse/TraverseFrontView.png",
      "assets/projects/traverse/TraverseBackView.png",
      "assets/projects/traverse/TraverseSideView.png",
      "assets/projects/traverse/TraverseRenderedView.png",
    ],
    skills: ["CAD", "Arduino", "Embedded Systems", "Mechanical Design", "Prototyping"],
    description:
      "A rail-mounted camera carriage designed to improve visibility in lecture halls through automated motorized movement and wireless video streaming.",
    links: [],
  },
  {
    slug: "eagle-scout",
    title: "Eagle Scout Project",
    subtitle: "Balance Beams for a Local Autism Center",
    categories: ["manufacturing"],
    heroImage: "assets/projects/EagleScout/IMG_9688.jpg",
    gallery: [
      "assets/projects/EagleScout/IMG_9688.jpg",
      "assets/projects/EagleScout/IMG_1440.jpg",
      "assets/projects/EagleScout/IMG_1546.jpg",
      "assets/projects/EagleScout/IMG_1560.jpg",
      "assets/projects/EagleScout/IMG_1576.jpg",
    ],
    videos: [],
    skills: ["Design", "Fabrication", "Project Management", "Budgeting", "Leadership"],
    description:
      "Designed and built 3 balance beams to support motor skill development for children with autism at a local autism center. Led 25 volunteers while ensuring structural integrity, safety compliance, and long-term durability.",
    result: "Delivered the full project with 25 volunteers for under $1,000.",
    links: [],
  },
  {
    slug: "rays",
    title: "RAYS",
    subtitle: "AI Disaster Warning System",
    categories: ["software-ai"],
    heroImage: "assets/projects/rays/QuakeandWaterLevelSensor.png",
    gallery: [
      "assets/projects/rays/Dashboard.png",
      "assets/projects/rays/DataPage.png",
      "assets/projects/rays/DisastersPage.png",
      "assets/projects/rays/EarthquakeSensorData.png",
      "assets/projects/rays/HumidityandTemperatureSensor.png",
      "assets/projects/rays/QuakeandWaterLevelSensor.png",
      "assets/projects/rays/RegionBluesLiveNaturalDisasters.png",
      "assets/projects/rays/TemperatureSensorData.png",
      "assets/projects/rays/WaterSensorData.png",
    ],
    skills: ["Arduino", "Raspberry Pi", "Machine Learning", "Web Development", "Data Analysis"],
    description:
      "A low-cost disaster monitoring platform designed to process environmental sensor data and provide real-time hazard awareness.",
    links: [],
  },
  {
    slug: "desk-setup",
    title: "Desk Setup Builds",
    subtitle: "Personal Projects",
    categories: ["manufacturing"],
    heroImage: "assets/projects/desk-setup/DeskSetupMainView.png",
    gallery: [
      "assets/projects/desk-setup/DeskSetupMainView.png",
      "assets/projects/desk-setup/DeskSetup2.png",
      "assets/projects/desk-setup/DeskSetup3.png",
      "assets/projects/desk-setup/DeskSetup4.png",
    ],
    videos: [],
    skills: ["Design", "Prototyping", "Fabrication"],
    description:
      "Projects I designed and built for fun: a laptop stand, a headphone stand, and a monitor stand.",
    links: [],
  },
];