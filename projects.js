// Ported from the original src/data/projects.ts
const PROJECTS = [
   {
    slug: "silver",
    title: "Silver Bot",
    subtitle: "VEX U Competition Robot",
    heroImage: "assets/projects/silver/SilverMainView.png",
    gallery: [
      "assets/projects/silver/SilverMainView.png",
      "assets/projects/silver/SilverRenderedView.png",
      "assets/projects/silver/SilverSideView.png",
      "assets/projects/silver/SilverSideView2.png",
    ],
    skills: ["CAD", "Engineering Design", "Manufacturing", "Prototyping", "Robotics"],
    description:
      "A 24-inch VEX U robot designed from concept through competition with a focus on storage capacity, scoring efficiency, and autonomous performance.",
  },
  {
    slug: "sonic",
    title: "Sonic Bot",
    subtitle: "VEX U Competition Robot",
    heroImage: "assets/projects/sonic/SonicMainView.png",
    gallery: [
      "assets/projects/sonic/SonicMainView.png",
      "assets/projects/sonic/SonicFrontView.png",
      "assets/projects/sonic/SonicIntakeView.png",
      "assets/projects/sonic/SonicRenderedView.png",
      "assets/projects/sonic/SonicSideView.png",
    ],
    skills: ["CAD", "Engineering Design", "Manufacturing", "Optimization", "Robotics"],
    description:
      "A VEX U competition robot designed for the Push Back season, focused on reliability, intake performance, and strategic scoring mechanisms.",
  },
  {
    slug: "traverse",
    title: "Traverse",
    subtitle: "Rail-Mounted Camera System",
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
  },
  {
    slug: "compressed-air-motor",
    title: "Compressed Air Motor",
    subtitle: "Machining & Manufacturing Project",
    heroImage: "assets/projects/compressed-air-motor/CompressedAirMotorFrontView.png",
    gallery: [
      "assets/projects/compressed-air-motor/CompressedAirMotorFrontView.png",
      "assets/projects/compressed-air-motor/CompressedAirMotorSideView.png",
      "assets/projects/compressed-air-motor/CompressedAirMotorTopView.png",
    ],
    skills: ["Machining", "Lathe", "Mill", "Manufacturing", "Mechanical Design"],
    description:
      "A compressed air engine machined from raw aluminum and brass using manual manufacturing processes and precision tolerancing.",
  },
  {
    slug: "smartbins",
    title: "SmartBins",
    subtitle: "AI-Powered Recycling Sorting System",
    heroImage: "assets/projects/smartbins/SmartBinsMainView.png",
    gallery: [
      "assets/projects/smartbins/SmartBinsMainView.png",
      "assets/projects/smartbins/SmartBinsDashboardView.png",
      "assets/projects/smartbins/SmartBinsCodeandDashboardView.png",
      "assets/projects/smartbins/SmartBinsInsertTrashView.png",
    ],
    skills: ["TensorFlow", "OpenCV", "Arduino", "Raspberry Pi", "Machine Learning", "Computer Vision"],
    description:
      "An intelligent waste sorting system that combines computer vision, embedded hardware, and real-time analytics to automatically classify and sort recyclable materials.",
  },
  {
    slug: "rays",
    title: "RAYS",
    subtitle: "AI Disaster Warning System",
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
  },
];