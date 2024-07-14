import React, { useEffect, useReducer, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import {
	Stat,
	Heading,
	Spacer,
	Flex,
	Box,
	Button,
	Spinner,
	HStack,
	Grid, 
	ListItem,
	List, 
	ListIcon,
	Thead,
	Tr,
	Tbody,
	Table,
	Th,
	Td
} from "@chakra-ui/react";
import { CheckCircleIcon, TriangleDownIcon, TriangleUpIcon, WarningIcon } from "@chakra-ui/icons";
import axios from "axios";
import StockChart from "../components/StockChart";
import TransactionPane from "../components/TransactionPane";
import accounts from "../services/accounts.service";
import tokens from "../services/tokens.service";
import Newsfeed from "../components/Newsfeed";
import {
	AddIcon,
	ArrowDownIcon,
	ArrowUpIcon,
	MinusIcon,
} from "@chakra-ui/icons";

const formatter = new Intl.NumberFormat("en-US", {
	style: "currency",
	currency: "USD",
});

const businessDescriptions = {
	AAPL: "Apple Inc. is an American multinational technology company that designs, manufactures, and markets consumer electronics, software, and online services.",
	MSFT: "Microsoft Corporation is an American multinational technology corporation which produces computer software, consumer electronics, personal computers, and related services.",
	GOOG: "Alphabet Inc. is an American multinational conglomerate headquartered in Mountain View, California. It is the parent company of Google and several former Google subsidiaries.",
	INFY: "Infosys Limited is an Indian multinational corporation that provides business consulting, information technology, and outsourcing services.",
	TSLA: "Tesla, Inc. is an American electric vehicle and clean energy company known for its electric cars, solar products, and energy storage solutions.",
	SAMSUNG: "Samsung Electronics Co., Ltd. is a South Korean multinational electronics company known for its smartphones, TVs, and semiconductors.",
	COCACOLA: "The Coca-Cola Company is an American multinational beverage corporation known for its carbonated soft drinks.",
	ADBE: "Adobe Inc. is an American multinational computer software company known for its creativity and multimedia software products.",
	PEPSICO: "PepsiCo, Inc. is an American multinational food, snack, and beverage corporation known for its wide range of products, including Pepsi, Mountain Dew, Lay's, and Tropicana.",
	MCD: "McDonald's Corporation is an American multinational fast food company known for its hamburgers, cheeseburgers, french fries, and a variety of other fast food items.",
	ALIBABA: "Alibaba Group Holding Limited is a Chinese multinational conglomerate specializing in e-commerce, retail, internet, and technology, known for its online marketplaces like Taobao and Tmall.",
	TCS: "Tata Consultancy Services Limited is an Indian multinational information technology services and consulting company, known for its IT services, business solutions, and outsourcing.",
	HDFC: "HDFC Bank Limited is an Indian banking and financial services company, known for its comprehensive range of financial products and services, including loans, credit cards, and savings accounts.",
	UBER: "Uber Technologies, Inc. is an American technology company known for its ride-hailing services, as well as its ventures into food delivery, package delivery, and freight transportation.",
	OLA: "Ola Cabs, also known as Ola, is an Indian ride-hailing company providing services that include peer-to-peer ridesharing, ride service hailing, taxi, and food delivery.",
	DIOR: "Christian Dior SE, commonly known as Dior, is a French luxury goods company known for its haute couture, fashion accessories, fragrances, and cosmetics.",
	GUCCI: "Gucci is an Italian luxury fashion house known for its high-end leather goods, fashion apparel, accessories, and fragrances.",
	INTC: "Intel Corporation is an American multinational corporation and technology company known for designing and manufacturing microprocessors and semiconductor chips.",
	NIKE: "Nike, Inc. is an American multinational corporation known for its design, manufacturing, and marketing of footwear, apparel, equipment, and accessories.",
	BOEING: "The Boeing Company is an American multinational corporation that designs, manufactures, and sells airplanes, rotorcraft, rockets, satellites, and telecommunications equipment.",
	SONY: "Sony Group Corporation is a Japanese multinational conglomerate known for its electronics, gaming, entertainment, and financial services, including products like PlayStation, Bravia TVs, and Sony Music.",
	ICICI: "ICICI Bank Limited is an Indian multinational banking and financial services company known for its wide range of banking products and financial services for corporate and retail customers.",
	HP: "HP Inc. is an American multinational information technology company known for its personal computers, printers, and related supplies and services.",
	DELL: "Dell Technologies Inc. is an American multinational technology company known for its personal computers, servers, data storage devices, network switches, software, and peripherals.",
	STARBUCKS: "Starbucks Corporation is an American multinational chain of coffeehouses and roastery reserves known for its high-quality coffee, teas, pastries, and merchandise.",
	MITSUBISHI: "Mitsubishi Corporation is a Japanese multinational conglomerate with a diverse range of businesses including automotive, electronics, heavy industries, energy, and financial services.",
	ADIDAS: "Adidas AG is a German multinational corporation that designs and manufactures sports shoes, clothing, and accessories, known for its innovative athletic products and iconic three-stripe logo.",
	MERCEDES: "Mercedes-Benz is a German luxury automobile manufacturer known for its high-end vehicles, including cars, trucks, and buses, renowned for their engineering, performance, and innovation in the automotive industry.",
	VOLKSWAGEN: "Volkswagen AG is a German multinational automotive manufacturer known for its wide range of vehicles, from economy cars to luxury models under various brands.",
	BOSE: "Bose Corporation is an American manufacturing company known for its audio equipment, including speakers, headphones, and automotive sound systems.",
	DOMINOS: "Domino's Pizza, Inc. is an American multinational pizza restaurant chain known for its pizza delivery and carryout services.",
	TACOBELL: "Taco Bell is an American fast-food chain known for its Mexican-inspired menu, including tacos, burritos, and quesadillas.",
	KFC: "KFC (Kentucky Fried Chicken) is an American fast-food restaurant chain known for its fried chicken and related menu items.",
	AMAZON: "Amazon.com, Inc. is an American multinational technology company focusing on e-commerce, cloud computing, digital streaming, and artificial intelligence.",
	EBAY: "eBay Inc. is an American multinational e-commerce corporation that facilitates consumer-to-consumer and business-to-consumer sales through its website.",
	ETSY: "Etsy, Inc. is an American e-commerce company focused on handmade or vintage items and craft supplies, including jewelry, bags, clothing, home decor, and furniture.",
	SBI: "State Bank of India (SBI) is an Indian multinational public sector bank and financial services company, known for a wide range of banking and financial services.",
	FEDEX: "FedEx Corporation is an American multinational delivery services company known for its overnight shipping service and pioneering a system that could track packages and provide real-time updates on package location.",
	BLUEDART: "Blue Dart Express Ltd. is an Indian logistics company providing courier delivery services and is a subsidiary of DHL Express.",
	HUGOBOSS: "Hugo Boss AG is a German luxury fashion house known for its high-quality men's and women's clothing, accessories, footwear, and fragrances.",
	LOUISVUITTON: "Louis Vuitton Malletier, commonly referred to as Louis Vuitton, is a French luxury fashion house known for its high-end leather goods, ready-to-wear, shoes, watches, jewelry, accessories, and sunglasses.",
	AIRBUS: "Airbus SE is a European multinational aerospace corporation that designs, manufactures, and sells civil and military aeronautical products worldwide.",
	LOCKHEEDMARTIN: "Lockheed Martin Corporation is an American aerospace, defense, arms, security, and advanced technologies company with worldwide interests.",
	SPICEJET: "SpiceJet Limited is an Indian low-cost airline known for its domestic and international flight services.",
	UNDERARMOUR: "Under Armour, Inc. is an American sports equipment company that manufactures footwear, sports, and casual apparel.",
	LULULEMON: "Lululemon Athletica Inc. is a Canadian-American multinational athletic apparel retailer known for its high-quality yoga wear, activewear, and related accessories."
  };
  
  // Hardcoded sample pros and cons
// Hardcoded sample pros and cons
const prosAndCons = {
	AAPL: {
	  pros: [
		"Strong brand recognition",
		"Innovative product line",
		"Robust financial health"
	  ],
	  cons: [
		"High reliance on iPhone sales",
		"Intense competition in the tech industry",
		"Dependence on supply chain in China"
	  ],
	},
	MSFT: {
	  pros: [
		"Diverse product portfolio",
		"Strong presence in enterprise market",
		"Consistent revenue growth"
	  ],
	  cons: [
		"Regulatory challenges",
		"High competition in cloud computing",
		"Dependence on software sales"
	  ],
	},
	GOOG: {
	  pros: [
		"Dominance in search engine market",
		"Leader in digital advertising",
		"Strong R&D investment"
	  ],
	  cons: [
		"Privacy concerns and regulatory scrutiny",
		"Dependence on advertising revenue",
		"Intense competition in cloud and AI sectors"
	  ],
	},
	INFY: {
	  pros: [
		"Global leader in IT services",
		"Strong focus on innovation",
		"Wide range of industry solutions"
	  ],
	  cons: [
		"Dependency on client spending on IT",
		"Impact of geopolitical factors",
		"Competition from global IT services providers"
	  ],
	},
	TSLA: {
	  pros: [
		"Innovative electric vehicle technology",
		"Strong brand in the electric vehicle market",
		"Expanding global market presence"
	  ],
	  cons: [
		"Production scalability challenges",
		"Dependency on regulatory incentives",
		"Volatility in stock price"
	  ],
	},
	SAMSUNG: {
	  pros: [
		"Diversified product portfolio",
		"Strong market presence in consumer electronics",
		"Leadership in semiconductor technology"
	  ],
	  cons: [
		"Competition from other smartphone manufacturers",
		"Regulatory challenges in global markets",
		"Dependency on smartphone market cycles"
	  ],
	},
	COCACOLA: {
	  pros: [
		"Iconic global brand",
		"Extensive distribution network",
		"Diverse product portfolio beyond soft drinks"
	  ],
	  cons: [
		"Health concerns related to sugary beverages",
		"Changing consumer preferences towards healthier options",
		"Environmental impact of packaging"
	  ],
	},
	ADBE: {
	  pros: [
		"Leadership in creative software solutions",
		"Strong customer loyalty and brand recognition",
		"Innovative digital marketing and analytics tools"
	  ],
	  cons: [
		"Dependency on subscription-based revenue model",
		"High competition in digital marketing software",
		"Vulnerability to piracy and unauthorized use"
	  ],
	},
	MCD: {
	  pros: [
		"Global brand recognition and strong market presence",
		"Extensive and efficient supply chain",
		"Innovative menu options and adaptation to local tastes"
	  ],
	  cons: [
		"Health concerns and criticism over fast food",
		"High competition in the fast food industry",
		"Vulnerability to economic downturns affecting consumer spending"
	  ]
	},
	ALIBABA: {
	  pros: [
		"Dominance in Chinese e-commerce market",
		"Diverse revenue streams from various segments",
		"Strong growth in cloud computing services"
	  ],
	  cons: [
		"Regulatory challenges in China",
		"Intense competition from other global e-commerce giants",
		"Dependence on Chinese market for majority of revenue"
	  ]
	},
	TCS: {
	  pros: [
		"Leading IT services provider with a global presence",
		"Strong financial performance and profitability",
		"Diversified service offerings and client base"
	  ],
	  cons: [
		"Exposure to global economic fluctuations",
		"High competition in the IT services sector",
		"Challenges in maintaining talent and managing attrition"
	  ]
	},
	HDFC: {
	  pros: [
		"Strong brand reputation and customer loyalty",
		"Consistent financial performance and growth",
		"Comprehensive range of banking products and services"
	  ],
	  cons: [
		"Exposure to regulatory changes in the banking sector",
		"Dependence on Indian economy",
		"High competition from other financial institutions"
	  ]
	},
	UBER: {
	  pros: [
		"Global presence in ride-hailing and food delivery",
		"Strong brand recognition and customer base",
		"Innovative technology and expansion into new services"
	  ],
	  cons: [
		"Regulatory challenges in various markets",
		"High operational costs and ongoing losses",
		"Intense competition from other ride-hailing services"
	  ]
	},
	OLA: {
	  pros: [
		"Strong presence in Indian ride-hailing market",
		"Expansion into electric vehicle segment",
		"Diverse service offerings including food delivery and financial services"
	  ],
	  cons: [
		"Regulatory hurdles and compliance issues",
		"High competition from other ride-hailing services",
		"Operational challenges and profitability concerns"
	  ]
	},
	DIOR: {
	  pros: [
		"Strong brand heritage and global recognition",
		"High-quality luxury products with strong demand",
		"Innovative and trendsetting fashion designs"
	  ],
	  cons: [
		"High dependency on economic conditions affecting luxury spending",
		"Intense competition in the luxury fashion market",
		"Risk of brand dilution through overextension"
	  ]
	},
	GUCCI: {
	  pros: [
		"Iconic brand with strong global recognition",
		"Innovative and trendy fashion designs",
		"High profitability and demand for luxury products"
	  ],
	  cons: [
		"Vulnerability to economic downturns affecting luxury spending",
		"High competition from other luxury brands",
		"Challenges in maintaining brand exclusivity"
	  ]
	},
	INTC: {
	  pros: [
		"Leader in semiconductor manufacturing",
		"Strong research and development capabilities",
		"Diverse product portfolio including processors and memory"
	  ],
	  cons: [
		"Intense competition in the semiconductor industry",
		"Dependence on PC market",
		"Challenges in transitioning to new technologies"
	  ]
	},
	NKE: {
	  pros: [
		"Strong global brand and market presence",
		"Innovative product development and marketing strategies",
		"Diverse range of athletic apparel and footwear"
	  ],
	  cons: [
		"Exposure to economic downturns affecting consumer spending",
		"Intense competition from other sportswear brands",
		"Ethical concerns related to labor practices in supply chain"
	  ]
	},
	BOEING: {
	  pros: [
		"Leading aerospace and defense company",
		"Strong government contracts and defense revenue",
		"Innovative advancements in aviation technology"
	  ],
	  cons: [
		"Vulnerability to fluctuations in defense spending",
		"High costs and risks associated with aircraft manufacturing",
		"Intense competition from other aerospace companies"
	  ]
	},
	SONY: {
	  pros: [
		"Strong presence in electronics, gaming, and entertainment",
		"Innovative technology and product development",
		"Diverse revenue streams from multiple segments"
	  ],
	  cons: [
		"Intense competition in electronics and gaming industry",
		"Exposure to economic fluctuations",
		"Challenges in maintaining market share in various segments"
	  ]
	},
	ICICI: {
	  pros: [
		"Strong brand presence in Indian banking sector",
		"Comprehensive range of financial services",
		"Consistent financial growth and profitability"
	  ],
	  cons: [
		"Exposure to regulatory changes",
		"High competition in the banking industry",
		"Dependence on Indian economy"
	  ]
	},
	HP: {
	  pros: [
		"Strong brand recognition in computing and printing",
		"Innovative product development and technology",
		"Diversified product portfolio"
	  ],
	  cons: [
		"Intense competition in computing and printing industry",
		"Dependence on PC market",
		"Challenges in maintaining profitability"
	  ]
	},
	DELL: {
	  pros: [
		"Strong presence in PC and enterprise solutions market",
		"Innovative technology and product development",
		"Diverse range of computing products and services"
	  ],
	  cons: [
		"Intense competition in PC and enterprise market",
		"Dependence on global supply chain",
		"Challenges in maintaining market share"
	  ]
	},
	STARBUCKS: {
	  pros: [
		"Strong global brand recognition and market presence",
		"Commitment to ethical sourcing and sustainability",
		"Innovative product offerings and customer experience"
	  ],
	  cons: [
		"High competition in the coffee industry",
		"Vulnerability to economic downturns affecting consumer spending",
		"Challenges in maintaining growth in saturated markets"
	  ]
	},
	MITSUBISHI: {
	  pros: [
		"Diversified conglomerate with strong global presence",
		"Innovative advancements in various industries",
		"Strong financial stability and growth"
	  ],
	  cons: [
		"Exposure to economic fluctuations",
		"Intense competition in multiple sectors",
		"Challenges in maintaining profitability across diverse segments"
	  ]
	},
	ADIDAS: {
	  pros: [
		"Strong global brand and market presence",
		"Innovative product development in sportswear",
		"Diverse range of athletic apparel and footwear"
	  ],
	  cons: [
		"Intense competition from other sportswear brands",
		"Vulnerability to economic downturns affecting consumer spending",
		"Challenges in maintaining supply chain sustainability"
	  ]
	},
	MERCEDES: {
	  pros: [
		"Strong brand reputation and luxury market presence",
		"Innovative advancements in automotive technology",
		"High customer loyalty and brand recognition"
	  ],
	  cons: [
		"High competition in the luxury automobile market",
		"Vulnerability to economic downturns affecting luxury spending",
		"Challenges in maintaining profitability with high production costs"
	  ]
	},
	VOLKSWAGEN: {
	  pros: [
		"Wide range of vehicles",
		"Strong global presence",
		"Innovative automotive technology",
		"Commitment to electric vehicle development",
		"High brand recognition"
	  ],
	  cons: [
		"High competition in the automotive industry",
		"Emissions scandal affecting brand reputation"
	  ]
	},
	BOSE: {
	  pros: [
		"High-quality audio products",
		"Strong brand reputation",
		"Innovative technology",
		"Wide product range",
		"Excellent customer service"
	  ],
	  cons: [
		"High price point",
		"Limited product availability in some regions"
	  ]
	},
	DOMINOS: {
	  pros: [
		"Global presence",
		"Efficient delivery system",
		"Innovative menu options",
		"Strong brand recognition",
		"Customer loyalty programs"
	  ],
	  cons: [
		"Health concerns over fast food",
		"High competition in the pizza market"
	  ]
	},
	TACOBELL: {
	  pros: [
		"Strong brand recognition",
		"Innovative menu options",
		"Efficient service",
		"Global presence",
		"Affordable pricing"
	  ],
	  cons: [
		"Health concerns over fast food",
		"High competition in the fast food industry"
	  ]
	},
	KFC: {
	  pros: [
		"Global brand recognition",
		"Strong market presence",
		"Wide range of menu options",
		"Efficient supply chain",
		"Innovative marketing strategies"
	  ],
	  cons: [
		"Health concerns over fried food",
		"High competition in the fast food industry"
	  ]
	},
	AMAZON: {
	  pros: [
		"Wide range of products",
		"Efficient delivery system",
		"Innovative technology",
		"Strong market presence",
		"Global reach"
	  ],
	  cons: [
		"Concerns over worker conditions",
		"Regulatory scrutiny"
	  ]
	},
	EBAY: {
	  pros: [
		"Wide range of products",
		"Strong market presence",
		"Efficient platform for buying and selling",
		"Global reach",
		"Innovative features"
	  ],
	  cons: [
		"High competition from other e-commerce platforms",
		"Concerns over counterfeit products"
	  ]
	},
	ETSY: {
	  pros: [
		"Unique and handmade products",
		"Strong brand recognition",
		"Efficient platform for small sellers",
		"Innovative features",
		"Global reach"
	  ],
	  cons: [
		"High competition from other e-commerce platforms",
		"Concerns over quality control"
	  ]
	},
	SBI: {
	  pros: [
		"Strong brand presence in India",
		"Wide range of banking products",
		"Strong financial performance",
		"Extensive branch network",
		"Government backing"
	  ],
	  cons: [
		"High competition in the banking sector",
		"Regulatory challenges"
	  ]
	},
	FEDEX: {
	  pros: [
		"Strong global presence",
		"Efficient delivery system",
		"Innovative logistics technology",
		"Wide range of services",
		"Strong brand recognition"
	  ],
	  cons: [
		"High competition in the logistics industry",
		"Concerns over environmental impact"
	  ]
	},
	BLUEDART: {
	  pros: [
		"Strong presence in India",
		"Efficient delivery system",
		"Wide range of services",
		"Innovative logistics technology",
		"Strong brand recognition"
	  ],
	  cons: [
		"High competition in the logistics industry",
		"Concerns over environmental impact"
	  ]
	},
	HUGOBOSS: {
	  pros: [
		"Strong brand recognition",
		"High-quality products",
		"Innovative fashion designs",
		"Strong market presence",
		"Customer loyalty"
	  ],
	  cons: [
		"High competition in the fashion industry",
		"High price point"
	  ]
	},
	LOUISVUITTON: {
	  pros: [
		"Strong brand recognition",
		"High-quality luxury products",
		"Innovative fashion designs",
		"Global market presence",
		"Strong customer loyalty"
	  ],
	  cons: [
		"High competition in the luxury fashion market",
		"High price point"
	  ]
	},
	AIRBUS: {
	  pros: [
		"Leading aerospace company",
		"Innovative aviation technology",
		"Strong government contracts",
		"Wide range of aircraft",
		"Global market presence"
	  ],
	  cons: [
		"High competition in the aerospace industry",
		"Vulnerability to fluctuations in defense spending"
	  ]
	},
	LOCKHEEDMARTIN: {
	  pros: [
		"Leading defense contractor",
		"Innovative technology",
		"Strong government contracts",
		"Wide range of defense products",
		"Global market presence"
	  ],
	  cons: [
		"High competition in the defense industry",
		"Vulnerability to fluctuations in defense spending"
	  ]
	},
	SPICEJET: {
	  pros: [
		"Strong presence in Indian aviation market",
		"Affordable pricing",
		"Efficient service",
		"Innovative marketing strategies",
		"Wide range of flight options"
	  ],
	  cons: [
		"High competition in the aviation industry",
		"Concerns over financial stability"
	  ]
	},
	UNDERARMOUR: {
	  pros: [
		"Innovative athletic products",
		"Strong brand recognition",
		"Wide range of athletic apparel",
		"Efficient marketing strategies",
		"Global market presence"
	  ],
	  cons: [
		"High competition in the athletic apparel market",
		"Concerns over supply chain sustainability"
	  ]
	},
	LULULEMON: {
	  pros: [
		"Strong brand recognition",
		"High-quality athletic products",
		"Innovative product designs",
		"Efficient marketing strategies",
		"Global market presence"
	  ],
	  cons: [
		"High competition in the athletic apparel market",
		"High price point"
	  ]
	}
  };
  
  const executives = {
	AAPL: [
	  { name: "Tim Cook", position: "CEO" },
	  { name: "Luca Maestri", position: "CFO" },
	  { name: "Jeff Williams", position: "COO" },
	  { name: "Katherine Adams", position: "General Counsel" },
	  { name: "Deirdre O'Brien", position: "SVP, Retail and People" },
	],
	MSFT: [
	  { name: "Satya Nadella", position: "CEO" },
	  { name: "Amy Hood", position: "CFO" },
	  { name: "Brad Smith", position: "President" },
	  { name: "Jean-Philippe Courtois", position: "EVP, Global Sales" },
	  { name: "Kathleen Hogan", position: "EVP, Human Resources" },
	],
	GOOG: [
	  { name: "Sundar Pichai", position: "CEO" },
	  { name: "Ruth Porat", position: "CFO" },
	  { name: "Prabhakar Raghavan", position: "SVP, Search" },
	  { name: "Philipp Schindler", position: "SVP, Global Sales" },
	  { name: "Thomas Kurian", position: "CEO, Google Cloud" },
	],
	INFY: [
	  { name: "Salil Parekh", position: "CEO" },
	  { name: "Nilanjan Roy", position: "CFO" },
	  { name: "Ravi Kumar S", position: "President" },
	  { name: "Narsimha Rao M", position: "EVP, Growth Markets" },
	  { name: "Jayesh Sanghrajka", position: "Interim CFO" },
	],
	TSLA: [
	  // Add Tesla executives as per available data
	  { name: "Elon Musk", position: "CEO" },
	  { name: "Vaibhav Taneja", position: "CFO" },
	  { name: "Kevin Mukai", position: "Director Production Engineering" },
	  { name: "Natasha Mahmoudian", position: "Head Public Policy" },
	  { name: "Thomas Zhu", position: "Senior Vice-President Automative" },
	  // Add more Tesla executives as needed
	],
	SAMSUNG: [
	  // Add Samsung executives as per available data
	  { name: "Han Jong-hee", position: "Co-CEO" },
	  { name: "Kyung Kye-hyun", position: "Co-CEO" },
	  { name: "KS Choi", position: "President and CEO North America"},
	  { name: "Tae-Moon Roh", position: "President & Head of Mobile eXperience"},
	  { name: "Jung-Bae Lee", position: "President & Head of Memory Business"},
	  // Add more Samsung executives as needed
	],
	COCACOLA: [
	  // Add Coca-Cola executives as per available data
	  { name: "James Quincey", position: "CEO" },
	  { name: "Brian Smith", position: "COO" },
	  { name: "John Murphy", position: "CFO" },
	  { name: "Manuel Arroyo", position: "CMO" },
	  { name: "Brian Humphrey", position: "General Counsel" },
  
	  // Add more Coca-Cola executives as needed
	],
	ADBE: [
	  // Add Adobe executives as per available data
	  { name: "Shantanu Narayen", position: "CEO" },
	  { name: "Dan Durn", position: "CFO" },
	  { name: "Scott Belsky", position: "Chief Product Officer" },
	  { name: "David Wadhwani", position: "President Digital Media Business" },
	  { name: "Anil Chakravarthy", position: "President Digital Experience Business" },
	  // Add more Adobe executives as needed
	],
	PEPSICO: [
	  // Add Adobe executives as per available data
	  { name: "Ramon Laguarta", position: "CEO" },
	  { name: "Hugh F. Johnston", position: "CFO" },
	  { name: "Jim Andrew", position: "Executive Vice President and Chief Sustainability Officer" },
	  { name: "Mónica Bauer", position: "Global Chief Diversity, Equity, and Inclusion Officer" },
	  { name: "Björn Bernemann", position: "Chairman, International Franchise" },
	  // Add more Adobe executives as needed
	],
	MCD: [
	  { name: "Chris Kempczinski", position: "Chairman and Chief Executive Officer (CEO)" },
	  { name: "Ian Borden", position: "Executive Vice President and Global Chief Financial Officer (CFO)" },
	  { name: "Joe Erlinger", position: "President, McDonald's USA" },
	  { name: "Gillian McDonald", position: "Executive Vice President and President, International Operated Markets" },
	  { name: "Jon Banner", position: "Executive Vice President and Global Chief Impact Officer" },
	],
	ALIBABA : [
	  { name: "Joseph C. Tsai", position: "Chairman" },
	  { name: "Eddie Wu", position: "Director and Chief Executive Officer (CEO)" },
	  { name: "J. Michael Evans", position: "Director and President" },
	  { name: "Mohan Kuchhal", position: "Chief Financial Officer (CFO)" },
	  { name: "Lucy Peng", position: "Chief Customer Officer" },
	],  
	TCS: [
	  { name: "K. Krithivasan", position: "Chief Executive Officer and Managing Director" },
	  { name: "Milind Lakshman", position: "Chief Financial Officer" },
	  { name: "N Ganapathy Subramaniam", position: "President, TCS Digital" },
	  { name: "Suranjan Chatterjee", position: "Executive Vice President and Head, TCS CHRO" },
	  { name: "Samir Nirmal", position: "Chief Technology Officer" },
	],
	 HDFC: [
	  { "name": "Sashidhar Jagdishan", "position": "Managing Director and CEO" },
	  { "name": "Kaizad Bharucha", "position": "Executive Director" },
	  { "name": "Renu Karnad", "position": "Non-Executive Director" },
	  { "name": "Keki Mistry", "position": "Vice Chairman and CEO, HDFC Ltd." },
	  { "name": "Ravi Narain", "position": "Independent Director" }
  ],
  UBER: [
	  { name: "Dara Khosrowshahi", position: "CEO" },
	  { name: "Nelson Chai", position: "CFO" },
	  { name: "Tony West", position: "Chief Legal Officer" },
	  { name: "Andrew Macdonald", position: "SVP, Global Rides" },
	  { name: "Jill Hazelbaker", position: "SVP, Marketing and Public Affairs" },
	],
  OLA: [
	  { name: "Bhavish Aggarwal", position: "CEO" },
	  { name: "Arun Sarin", position: "Independent Director" },
	  { name: "Rajeev Misra", position: "Independent Director" },
	  { name: "Vishal Kaul", position: "COO" },
	  { name: "Pranay Jivrajka", position: "Co-founder" },
	],
  DIOR: [
	  { name: "Pietro Beccari", position: "CEO" },
	  { name: "Renaud de Lesquen", position: "President and CEO, North America" },
	  { name: "Kim Jones", position: "Artistic Director" },
	  { name: "Maria Grazia Chiuri", position: "Creative Director" },
	  { name: "Victoire de Castellane", position: "Creative Director, Jewelry" },
	],
  GUCCI: [
	  { name: "Marco Bizzarri", position: "President and CEO" },
	  { name: "François-Henri Pinault", position: "Chairman and CEO, Kering" },
	  { name: "Alessandro Michele", position: "Creative Director" },
	  { name: "Robert Triefus", position: "EVP, Brand and Customer Engagement" },
	  { name: "Sabato De Sarno", position: "Creative Director" },
	],
  INTC: [
	  { name: "Pat Gelsinger", position: "CEO" },
	  { name: "David Zinsner", position: "CFO" },
	  { name: "Sandra Rivera", position: "EVP and GM, Datacenter and AI" },
	  { name: "Gregory Bryant", position: "EVP and GM, Client Computing" },
	  { name: "Michelle Johnston Holthaus", position: "EVP and GM, Sales, Marketing and Communications" },
	],
  NIKE: [
	  { name: "John Donahoe", position: "President and CEO" },
	  { name: "Matthew Friend", position: "EVP and CFO" },
	  { name: "Mark Parker", position: "Executive Chairman" },
	  { name: "Heidi O'Neill", position: "President, Consumer and Marketplace" },
	  { name: "Andrew Campion", position: "COO" },
	],
  BOEING: [
	  { name: "David Calhoun", position: "President and CEO" },
	  { name: "Greg Smith", position: "CFO and EVP, Enterprise Operations" },
	  { name: "Stanley Deal", position: "President and CEO, Commercial Airplanes" },
	  { name: "Ted Colbert", position: "President and CEO, Global Services" },
	  { name: "Leanne Caret", position: "President and CEO, Defense, Space and Security" },
	],
  SONY: [
	  { name: "Kenichiro Yoshida", position: "Chairman, President and CEO" },
	  { name: "Hiroki Totoki", position: "EVP and CFO" },
	  { name: "Masaru Kato", position: "EVP" },
	  { name: "Ichiro Takagi", position: "EVP and COO, Electronics Products and Solutions" },
	  { name: "Naoki Negishi", position: "EVP and Chief Strategy Officer" },
	],
  ICICI: [
	  { name: "Sandeep Bakhshi", position: "Managing Director and CEO" },
	  { name: "Anup Bagchi", position: "Executive Director" },
	  { name: "V. Vaidyanathan", position: "Executive Director" },
	  { name: "Sandeep Batra", position: "Executive Director" },
	  { name: "Rakesh Jha", position: "Group CFO" },
	],
  HP: [
	  { name: "Enrique Lores", position: "President and CEO" },
	  { name: "Marie Myers", position: "CFO" },
	  { name: "Christoph Schell", position: "Chief Commercial Officer" },
	  { name: "Alex Cho", position: "President, Personal Systems" },
	  { name: "Tuan Tran", position: "President, Imaging, Printing and Solutions" },
	],
  DELL: [
	  { name: "Michael Dell", position: "Chairman and CEO" },
	  { name: "Tom Sweet", position: "CFO" },
	  { name: "Jeff Clarke", position: "COO and Vice Chairman" },
	  { name: "Allison Dew", position: "Chief Marketing Officer" },
	  { name: "Aongus Hegarty", position: "President, International Markets" },
	],
  STARBUCKS: [
	  { name: "Laxman Narasimhan", position: "CEO" },
	  { name: "Rachel Ruggeri", position: "CFO" },
	  { name: "Brady Brewer", position: "Chief Marketing Officer" },
	  { name: "John Culver", position: "Group President, North America and COO" },
	  { name: "Michael Conway", position: "Group President, International and Channel Development" },
	],
  MITSUBISHI: [
	  { name: "Takehiko Kakiuchi", position: "President and CEO" },
	  { name: "Kazuyuki Masu", position: "CFO" },
	  { name: "Ken Kobayashi", position: "Chairman" },
	  { name: "Jun Ota", position: "Chief Technology Officer" },
	  { name: "Yoshihiro Sekido", position: "Chief Compliance Officer" },
	],
  ADIDAS: [
	  { name: "Kasper Rørsted", position: "CEO" },
	  { name: "Harm Ohlmeyer", position: "CFO" },
	  { name: "Brian Grevy", position: "Executive Board Member, Global Brands" },
	  { name: "Martin Shankland", position: "Executive Board Member, Global Operations" },
	  { name: "Amanda Rajkumar", position: "Executive Board Member, Global Human Resources" },
	],
  MERCEDES: [
	  { name: "Ola Källenius", position: "Chairman of the Board of Management" },
	  { name: "Harald Wilhelm", position: "CFO" },
	  { name: "Markus Schäfer", position: "Chief Technology Officer" },
	  { name: "Britta Seeger", position: "Member of the Board of Management, Marketing and Sales" },
	  { name: "Renata Jungo Brüngger", position: "Member of the Board of Management, Integrity and Legal Affairs" },
	],
	VOLKSWAGEN: [
		{ name: "Herbert Diess", position: "CEO" },
		{ name: "Arno Antlitz", position: "CFO" },
		{ name: "Ralf Brandstätter", position: "COO" },
		{ name: "Hiltrud Werner", position: "Board Member, Integrity and Legal Affairs" },
		{ name: "Gunnar Kilian", position: "Board Member, Human Resources" },
	  ],
	  BOSE: [
		{ name: "Lila Snyder", position: "CEO" },
		{ name: "Jim Scammon", position: "CFO" },
		{ name: "John Roselli", position: "SVP, Global Sales" },
		{ name: "Ed Bos", position: "CTO" },
		{ name: "Eric Crouse", position: "General Counsel" },
	  ],
	  DOMINOS: [
		{ name: "Russell Weiner", position: "CEO" },
		{ name: "Sandeep Reddy", position: "CFO" },
		{ name: "Stuart Levy", position: "COO" },
		{ name: "David A. Brandon", position: "Chairman" },
		{ name: "Kevin Vasconi", position: "CIO" },
	  ],
	  TACOBELL: [
		{ name: "Mark King", position: "CEO" },
		{ name: "Liz Williams", position: "President, Taco Bell International" },
		{ name: "Julie Felss Masino", position: "President, Taco Bell North America" },
		{ name: "Jared Dougherty", position: "CFO" },
		{ name: "Brian Niccol", position: "Chairman" },
	  ],
	  KFC: [
		{ name: "Tony Lowings", position: "CEO" },
		{ name: "Catherine Tan-Gillespie", position: "CMO" },
		{ name: "Sabir Sami", position: "COO" },
		{ name: "Chris Turner", position: "CFO" },
		{ name: "Joanne Todd", position: "Chief Legal Officer" },
	  ],
	  AMAZON: [
		{ name: "Andy Jassy", position: "CEO" },
		{ name: "Brian Olsavsky", position: "CFO" },
		{ name: "David Zapolsky", position: "General Counsel" },
		{ name: "Dave Clark", position: "CEO, Worldwide Consumer" },
		{ name: "Adam Selipsky", position: "CEO, Amazon Web Services" },
	  ],
	  EBAY: [
		{ name: "Jamie Iannone", position: "CEO" },
		{ name: "Steve Priest", position: "CFO" },
		{ name: "Jordan Sweetnam", position: "SVP, Americas Market" },
		{ name: "Pete Thompson", position: "Chief Product Officer" },
		{ name: "Wendy Jones", position: "COO" },
	  ],
	  ETSY: [
		{ name: "Josh Silverman", position: "CEO" },
		{ name: "Rachel Glaser", position: "CFO" },
		{ name: "Raina Moskowitz", position: "COO" },
		{ name: "Krin Riegler", position: "General Counsel" },
		{ name: "Ryan Scott", position: "CMO" },
	  ],
	  SBI: [
		{ name: "Dinesh Kumar Khara", position: "Chairman" },
		{ name: "Ashwini Kumar Tewari", position: "MD, International Banking" },
		{ name: "Swaminathan Janakiraman", position: "MD, Corporate Banking" },
		{ name: "Challa Sreenivasulu Setty", position: "MD, Retail and Digital Banking" },
		{ name: "Arijit Basu", position: "Group Executive" },
	  ],
	  FEDEX: [
		{ name: "Raj Subramaniam", position: "President and CEO" },
		{ name: "Mike Lenz", position: "CFO" },
		{ name: "Robert B. Carter", position: "CIO" },
		{ name: "Brie Carere", position: "EVP, Chief Marketing and Communications Officer" },
		{ name: "Richard W. Smith", position: "Regional President, Americas" },
	  ],
	  BLUEDART: [
		{ name: "Balfour Manuel", position: "Managing Director" },
		{ name: "Anil Khanna", position: "CFO" },
		{ name: "R.S. Subramanian", position: "SVP, Operations" },
		{ name: "Pradeep Parmar", position: "General Counsel" },
		{ name: "Ketan Kulkarni", position: "Chief Marketing Officer" },
	  ],
	  HUGOBOSS: [
		{ name: "Daniel Grieder", position: "CEO" },
		{ name: "Yves Müller", position: "CFO" },
		{ name: "Oliver Timm", position: "Chief Sales Officer" },
		{ name: "Heiko Schäfer", position: "COO" },
		{ name: "Gerrit Ruetzel", position: "President and CEO, Americas" },
	  ],
	  LOUISVUITTON: [
		{ name: "Michael Burke", position: "Chairman and CEO" },
		{ name: "Delphine Arnault", position: "EVP" },
		{ name: "Pietro Beccari", position: "CEO, Louis Vuitton Fashion" },
		{ name: "Anthony Ledru", position: "CEO, Louis Vuitton USA" },
		{ name: "Chantal Gaemperle", position: "EVP, Human Resources and Synergies" },
	  ],
	  AIRBUS: [
		{ name: "Guillaume Faury", position: "CEO" },
		{ name: "Dominik Asam", position: "CFO" },
		{ name: "Thierry Baril", position: "Chief Human Resources Officer" },
		{ name: "Michael Schoellhorn", position: "COO" },
		{ name: "Jean-Marc Nasr", position: "Head of Space Systems" },
	  ],
	  LOCKHEEDMARTIN: [
		{ name: "James Taiclet", position: "Chairman, President, and CEO" },
		{ name: "Kenneth R. Possenriede", position: "CFO" },
		{ name: "Stephanie C. Hill", position: "EVP, Rotary and Mission Systems" },
		{ name: "Frank A. St. John", position: "COO" },
		{ name: "Richard F. Ambrose", position: "EVP, Space" },
	  ],
	  SPICEJET: [
		{ name: "Ajay Singh", position: "Chairman and Managing Director" },
		{ name: "Kiran Koteshwar", position: "CFO" },
		{ name: "Shilpa Bhatia", position: "Chief Commercial Officer" },
		{ name: "Manjiv Singh", position: "Chief Strategy Officer" },
		{ name: "Arun Kashyap", position: "COO" },
	  ],
	  UNDERARMOUR: [
		{ name: "Patrik Frisk", position: "CEO" },
		{ name: "David Bergman", position: "CFO" },
		{ name: "Colin Browne", position: "COO" },
		{ name: "Lisa Collier", position: "Chief Product Officer" },
		{ name: "Alessandro de Pestel", position: "CMO" },
	  ],
	  LULULEMON: [
		{ name: "Calvin McDonald", position: "CEO" },
		{ name: "Meghan Frank", position: "CFO" },
		{ name: "Celeste Burgoyne", position: "President, Americas and Global Guest Innovation" },
		{ name: "Sun Choe", position: "Chief Product Officer" },
		{ name: "Alexis Miller", position: "Chief Supply Chain Officer" },
	  ],
  };
  const topProducts = {
	AAPL: [
	  { name: "iPhone", share: "54%", insight: "Key driver of revenue growth" },
	  { name: "iPad", share: "9%", insight: "Significant market share in tablets" },
	  { name: "Mac", share: "10%", insight: "Strong in professional segments" },
	  { name: "Services", share: "20%", insight: "Growing at a rapid pace" },
	  { name: "Other Products", share: "7%", insight: "Includes wearables like Apple Watch" },
	],
	MSFT: [
	  { name: "Office", share: "30%", insight: "Leader in productivity software" },
	  { name: "Windows", share: "25%", insight: "Dominates PC operating systems" },
	  { name: "Azure", share: "20%", insight: "Rapidly growing cloud platform" },
	  { name: "Gaming", share: "15%", insight: "Strong Xbox presence" },
	  { name: "Other Products", share: "10%", insight: "Includes Surface devices" },
	],
	GOOG: [
	  { name: "Search", share: "50%", insight: "Primary revenue source" },
	  { name: "YouTube", share: "20%", insight: "Massive user base" },
	  { name: "Cloud", share: "15%", insight: "Competing with AWS and Azure" },
	  { name: "Other Bets", share: "15%", insight: "Focus on innovative ventures" },
	],
	INFY: [
	  { name: "IT Services", share: "60%", insight: "Core business offering" },
	  { name: "Consulting", share: "20%", insight: "Strategic advisory services" },
	  { name: "Outsourcing", share: "15%", insight: "Managed services and BPO" },
	  { name: "Products", share: "5%", insight: "Software products and platforms" },
	],
	TSLA: [
	  // Add Tesla products as per available data
	  { name: "Model 3", share: "40%", insight: "High demand electric vehicle" },
	  { name: "Model S", share: "25%", insight: "Luxury electric sedan" },
	  // Add more Tesla products as needed
	],
	SAMSUNG: [
	  // Add Samsung products as per available data
	  { name: "Galaxy S Series", share: "30%", insight: "Flagship smartphones" },
	  { name: "Galaxy Tab Series", share: "20%", insight: "Popular tablets" },
	  // Add more Samsung products as needed
	],
	COCACOLA: [
	  // Add Coca-Cola products as per available data
	  { name: "Coca-Cola Classic", share: "60%", insight: "Iconic soft drink" },
	  { name: "Diet Coke", share: "20%", insight: "Low-calorie variant" },
	  // Add more Coca-Cola products as needed
	],
	ADBE: [
	  // Add Adobe products as per available data
	  { name: "Creative Cloud", share: "70%", insight: "Suite of creative software" },
	  { name: "Document Cloud", share: "15%", insight: "Document management solutions" },
	  // Add more Adobe products as needed
	],
  PEPSICO: [
	  { name: "Pepsi", share: "25%", insight: "Leading cola brand worldwide" },
	  { name: "Lay's", share: "20%", insight: "Top-selling snack brand" },
	  { name: "Gatorade", share: "18%", insight: "Dominates sports drinks market" },
	  { name: "Mountain Dew", share: "15%", insight: "Popular soft drink among youth" },
	  { name: "Quaker Foods", share: "10%", insight: "Strong presence in breakfast foods" },
  ],
  MCD: [
	  { name: "Big Mac", share: "20%", insight: "Iconic burger, global favorite" },
	  { name: "French Fries", share: "18%", insight: "Highly popular side item" },
	  { name: "Happy Meal", share: "15%", insight: "Preferred choice for children" },
	  { name: "McNuggets", share: "12%", insight: "Top-selling chicken item" },
	  { name: "McCafé", share: "10%", insight: "Strong presence in coffee market" },
  ],
  TCS: [
	  { name: "IT Services", share: "40%", insight: "Leader in IT consulting and services" },
	  { name: "Digital Transformation", share: "20%", insight: "Rapidly growing sector" },
	  { name: "Cloud Services", share: "15%", insight: "Strong cloud computing solutions" },
	  { name: "Cybersecurity", share: "10%", insight: "Robust security offerings" },
	  { name: "BPO", share: "8%", insight: "Established BPO service provider" },
  ],
  ALIBABA: [
	{ name: "E-commerce", share: "50.5%", insight: "Dominant player in Chinese e-commerce with Taobao and Tmall" },
	{ name: "Cloud Computing", share: "9.5%", insight: "Alibaba Cloud - Fastest growing cloud platform in Asia"},
	{name: "Logistics", share: "10%", insight: "Extensive logistics network with Cainiao Smart Network"},
	{name: "Digital Media & Entertainment", share: "8%", insight: "Owns Youku Tudou - Leading online video platform in China"},
	{name: "Innovation Initiatives", share: "22%", insight: "Investments in AI, fintech, and autonomous vehicles"}
	],
  UBER: [
	  { name: "Rides", share: "50%", insight: "Dominates ride-hailing market" },
	  { name: "Uber Eats", share: "30%", insight: "Significant player in food delivery" },
	  { name: "Freight", share: "10%", insight: "Expanding logistics services" },
	  { name: "Advanced Technologies", share: "5%", insight: "Investments in AI and autonomous vehicles" },
	  { name: "Other Services", share: "5%", insight: "Includes financial services" },
  ],
  OLA: [
	  { name: "Rides", share: "70%", insight: "Leading ride-hailing service in India" },
	  { name: "Electric Vehicles", share: "15%", insight: "Pioneering in EV market" },
	  { name: "Food Delivery", share: "10%", insight: "Growing food delivery segment" },
	  { name: "Financial Services", share: "5%", insight: "Expanding into financial services" },
  ],
  DIOR: [
	  { name: "Fashion & Accessories", share: "45%", insight: "Luxury fashion leader" },
	  { name: "Fragrances", share: "30%", insight: "Top-selling luxury perfumes" },
	  { name: "Cosmetics", share: "15%", insight: "High-end makeup products" },
	  { name: "Watches & Jewelry", share: "8%", insight: "Prestigious timepieces and jewelry" },
	  { name: "Other Products", share: "2%", insight: "Includes home decor" },
  ],
  GUCCI: [
	  { name: "Leather Goods", share: "40%", insight: "Premium leather products" },
	  { name: "Apparel", share: "30%", insight: "High fashion clothing" },
	  { name: "Footwear", share: "15%", insight: "Luxury shoes" },
	  { name: "Accessories", share: "10%", insight: "Designer bags and accessories" },
	  { name: "Fragrances", share: "5%", insight: "Exclusive perfumes" },
  ],
  INTC: [
	  { name: "PC Processors", share: "50%", insight: "Leading supplier of CPUs" },
	  { name: "Data Center", share: "30%", insight: "Strong presence in server processors" },
	  { name: "IoT", share: "10%", insight: "Expanding in IoT solutions" },
	  { name: "Memory", share: "7%", insight: "Robust memory product lineup" },
	  { name: "Other Products", share: "3%", insight: "Includes FPGA and software" },
  ],
  NIKE: [
	  { name: "Footwear", share: "60%", insight: "Global leader in sports shoes" },
	  { name: "Apparel", share: "25%", insight: "High performance athletic wear" },
	  { name: "Equipment", share: "10%", insight: "Sports equipment and accessories" },
	  { name: "Digital", share: "3%", insight: "Growing digital presence" },
	  { name: "Other Products", share: "2%", insight: "Includes collaborations and limited editions" },
  ],
  BOEING: [
	  { name: "Commercial Airplanes", share: "60%", insight: "Leading aircraft manufacturer" },
	  { name: "Defense, Space & Security", share: "25%", insight: "Strong military contracts" },
	  { name: "Global Services", share: "10%", insight: "Comprehensive service offerings" },
	  { name: "Innovation & Technology", share: "3%", insight: "Pioneering aerospace technology" },
	  { name: "Other Products", share: "2%", insight: "Includes space exploration" },
  ],
  SONY: [
	  { name: "Gaming & Network Services", share: "40%", insight: "PlayStation's strong market position" },
	  { name: "Electronics", share: "25%", insight: "Wide range of consumer electronics" },
	  { name: "Music", share: "15%", insight: "Top music label and publisher" },
	  { name: "Pictures", share: "10%", insight: "Major film and TV studio" },
	  { name: "Financial Services", share: "5%", insight: "Expanding financial sector" },
  ],
  ICICI: [
	  { name: "Retail Banking", share: "40%", insight: "Large customer base in India" },
	  { name: "Corporate Banking", share: "30%", insight: "Strong business banking services" },
	  { name: "Insurance", share: "15%", insight: "Wide range of insurance products" },
	  { name: "Investment Banking", share: "10%", insight: "Robust investment solutions" },
	  { name: "Other Services", share: "5%", insight: "Includes wealth management" },
  ],
  HP: [
	  { name: "Printing", share: "35%", insight: "Market leader in printers" },
	  { name: "Personal Systems", share: "30%", insight: "Strong PC market presence" },
	  { name: "Enterprise Services", share: "20%", insight: "Comprehensive business solutions" },
	  { name: "Software", share: "10%", insight: "Growing software offerings" },
	  { name: "Other Products", share: "5%", insight: "Includes 3D printing" },
  ],
  DELL: [
	  { name: "Client Solutions", share: "50%", insight: "Top PC and laptop supplier" },
	  { name: "Infrastructure Solutions", share: "30%", insight: "Strong server and storage products" },
	  { name: "VMware", share: "10%", insight: "Leading virtualization software" },
	  { name: "Financial Services", share: "5%", insight: "Growing financial arm" },
	  { name: "Other Products", share: "5%", insight: "Includes peripherals and accessories" },
  ],
  STARBUCKS: [
	  { name: "Beverages", share: "60%", insight: "Leading coffeehouse chain" },
	  { name: "Food", share: "20%", insight: "Popular food items and snacks" },
	  { name: "Packaged Goods", share: "10%", insight: "Grocery store presence" },
	  { name: "Digital", share: "5%", insight: "Strong digital and mobile order growth" },
	  { name: "Other Products", share: "5%", insight: "Includes merchandise" },
  ],
  MITSUBISHI: [
	  { name: "Automobiles", share: "50%", insight: "Strong presence in automotive market" },
	  { name: "Electronics", share: "20%", insight: "Wide range of consumer electronics" },
	  { name: "Heavy Industries", share: "15%", insight: "Industrial equipment and machinery" },
	  { name: "Financial Services", share: "10%", insight: "Expanding financial sector" },
	  { name: "Other Products", share: "5%", insight: "Includes chemicals and materials" },
  ],
  ADIDAS: [
	  { name: "Samba", share: "15%", insight: "Declared 'Shoe of the Year 2023'" },
	  { name: "Ultraboost", share: "12%", insight: "Popular running shoe with innovative cushioning" },
	  { name: "Stan Smith", share: "10%", insight: "Classic sneaker with enduring popularity" },
	  { name: "Gazelle", share: "10%", insight: "Iconic style, popular in lifestyle segment" },
	  { name: "Adizero Adios Pro Evo 1", share: "8%", insight: "Revolutionary lightweight racing shoe" },
  ],
  
  MERCEDES: [
	  { name: "C-Class", share: "20%", insight: "Best-selling model globally" },
	  { name: "E-Class", share: "18%", insight: "Known for luxury and advanced technology" },
	  { name: "GLC", share: "15%", insight: "Popular compact SUV" },
	  { name: "S-Class", share: "12%", insight: "Flagship luxury sedan" },
	  { name: "GLE", share: "10%", insight: "Midsize luxury SUV" },
  ],
  VOLKSWAGEN: [
    { name: "Volkswagen Golf", share: "22%", insight: "Popular compact car globally" },
    { name: "Volkswagen Tiguan", share: "18%", insight: "Compact SUV with strong sales" },
    { name: "Volkswagen Passat", share: "15%", insight: "Mid-size sedan known for comfort" },
    { name: "Audi A4", share: "20%", insight: "Luxury sedan under Volkswagen Group" },
    { name: "Porsche 911", share: "25%", insight: "Iconic sports car model" },
  ],
  BOSE: [
    { name: "Bose QuietComfort", share: "40%", insight: "Leading noise-canceling headphones" },
    { name: "Bose SoundLink", share: "25%", insight: "Portable Bluetooth speakers" },
    { name: "Bose Home Speaker", share: "20%", insight: "Smart home audio systems" },
    { name: "Bose Wave", share: "10%", insight: "Compact music systems" },
    { name: "Bose Frames", share: "5%", insight: "Audio sunglasses" },
  ],
  DOMINOS: [
    { name: "Domino's Pizza", share: "65%", insight: "Global leader in pizza delivery" },
    { name: "Chicken Wings", share: "15%", insight: "Popular side dish" },
    { name: "Subs and Sandwiches", share: "10%", insight: "Variety of sandwich options" },
    { name: "Pasta", share: "5%", insight: "Italian pasta dishes" },
    { name: "Desserts", share: "5%", insight: "Sweet treats like chocolate lava cakes" },
  ],
  TACOBELL: [
    { name: "Tacos", share: "50%", insight: "Signature menu item" },
    { name: "Burritos", share: "30%", insight: "Popular choice with customizable options" },
    { name: "Quesadillas", share: "15%", insight: "Cheesy and satisfying option" },
    { name: "Nachos", share: "5%", insight: "Crunchy snack or meal option" },
    { name: "Chalupas", share: "5%", insight: "Thick tortilla with toppings" },
  ],
  KFC: [
    { name: "Original Recipe Chicken", share: "45%", insight: "Iconic recipe with secret blend of herbs and spices" },
    { name: "Chicken Sandwiches", share: "20%", insight: "Variety of chicken sandwich options" },
    { name: "Chicken Tenders", share: "15%", insight: "Tender strips of chicken" },
    { name: "Fries and Sides", share: "10%", insight: "Popular sides like mashed potatoes and coleslaw" },
    { name: "Desserts", share: "10%", insight: "Sweet treats like biscuits and pies" },
  ],
  AMAZON: [
    { name: "Amazon Prime", share: "30%", insight: "Subscription service for fast delivery and streaming" },
    { name: "Amazon Web Services", share: "60%", insight: "Cloud computing services" },
    { name: "Echo Devices", share: "5%", insight: "Smart speakers with Alexa" },
    { name: "Kindle", share: "3%", insight: "E-readers for books and digital content" },
    { name: "Fire Tablets", share: "2%", insight: "Tablet devices for entertainment" },
  ],
  EBAY: [
    { name: "Collectibles", share: "30%", insight: "Unique and rare items" },
    { name: "Electronics", share: "25%", insight: "Consumer electronics" },
    { name: "Fashion", share: "20%", insight: "Clothing and accessories" },
    { name: "Home and Garden", share: "15%", insight: "Products for home improvement and decor" },
    { name: "Toys and Hobbies", share: "10%", insight: "Games, toys, and hobbies" },
  ],
  ETSY: [
    { name: "Handmade Jewelry", share: "35%", insight: "Unique artisan jewelry pieces" },
    { name: "Vintage Items", share: "25%", insight: "Antique and retro collectibles" },
    { name: "Craft Supplies", share: "20%", insight: "Materials for DIY projects" },
    { name: "Home Decor", share: "15%", insight: "Artistic decor items" },
    { name: "Clothing and Accessories", share: "5%", insight: "Fashionable handmade apparel" },
  ],
  SBI: [
    { name: "Personal Banking", share: "50%", insight: "Retail banking services" },
    { name: "Corporate Banking", share: "20%", insight: "Banking solutions for businesses" },
    { name: "International Banking", share: "15%", insight: "Services for global transactions" },
    { name: "Wealth Management", share: "10%", insight: "Financial planning and investment services" },
    { name: "Digital Banking", share: "5%", insight: "Online and mobile banking solutions" },
  ],
  FEDEX: [
    { name: "Express Delivery", share: "50%", insight: "Fast international shipping services" },
    { name: "Ground Delivery", share: "30%", insight: "Domestic shipping solutions" },
    { name: "Freight Services", share: "10%", insight: "Heavy and bulky item shipping" },
    { name: "Customs Brokerage", share: "5%", insight: "Customs clearance services" },
    { name: "Supply Chain Solutions", share: "5%", insight: "Logistics and distribution services" },
  ],
  BLUEDART: [
    { name: "Domestic Express", share: "60%", insight: "Fast delivery within India" },
    { name: "International Express", share: "20%", insight: "Global shipping solutions" },
    { name: "Freight Services", share: "10%", insight: "Cargo and logistics support" },
    { name: "E-commerce Solutions", share: "5%", insight: "Specialized services for online businesses" },
    { name: "Supply Chain Services", share: "5%", insight: "End-to-end logistics management" },
  ],
  HUGOBOSS: [
    { name: "Men's Suits", share: "30%", insight: "High-quality tailored suits" },
    { name: "Women's Dresses", share: "25%", insight: "Elegant and stylish dresses" },
    { name: "Fragrances", share: "20%", insight: "Luxurious perfumes and colognes" },
    { name: "Accessories", share: "15%", insight: "Fashionable belts, bags, and shoes" },
    { name: "Eyewear", share: "10%", insight: "Designer sunglasses and glasses" },
  ],
  LOUISVUITTON: [
    { name: "Handbags", share: "40%", insight: "Iconic luxury handbags" },
    { name: "Ready-to-Wear", share: "30%", insight: "Fashionable clothing for men and women" },
    { name: "Shoes", share: "15%", insight: "Designer footwear" },
    { name: "Accessories", share: "10%", insight: "Luxury belts, scarves, and jewelry" },
    { name: "Fragrances", share: "5%", insight: "Exclusive perfumes and colognes" },
  ],
  AIRBUS: [
    { name: "Commercial Aircraft", share: "70%", insight: "Leading manufacturer of passenger planes" },
    { name: "Military Aircraft", share: "15%", insight: "Defence and security aircraft solutions" },
    { name: "Helicopters", share: "10%", insight: "Civil and military rotorcraft" },
    { name: "Space Systems", share: "5%", insight: "Satellites and space exploration technology" },
    { name: "Services", share: "5%", insight: "Support and maintenance services" },
  ],
  LOCKHEEDMARTIN: [
    { name: "Aeronautics", share: "50%", insight: "Advanced fighter jets and aircraft" },
    { name: "Missiles and Fire Control", share: "20%", insight: "Precision weaponry and defense systems" },
    { name: "Rotary and Mission Systems", share: "15%", insight: "Integrated naval combat systems" },
    { name: "Space", share: "10%", insight: "Satellites and space exploration technology" },
    { name: "Cybersecurity", share: "5%", insight: "Defense against cyber threats" },
  ],
  SPICEJET: [
    { name: "Domestic Flights", share: "60%", insight: "Passenger flights within India" },
    { name: "International Flights", share: "20%", insight: "Global flight destinations" },
    { name: "Cargo Services", share: "10%", insight: "Freight and logistics support" },
    { name: "Charter Flights", share: "5%", insight: "Private and business jet services" },
    { name: "Ancillary Services", share: "5%", insight: "Additional travel services" },
  ],
  UNDERARMOUR: [
    { name: "Performance Apparel", share: "50%", insight: "Sportswear designed for performance" },
    { name: "Footwear", share: "25%", insight: "Athletic shoes for various sports" },
    { name: "Accessories", share: "15%", insight: "Gloves, caps, and bags" },
    { name: "Athleisure", share: "5%", insight: "Casual wear with sporty elements" },
    { name: "Connected Fitness", share: "5%", insight: "Fitness tracking technology" },
  ],
  LULULEMON: [
    { name: "Yoga Pants", share: "40%", insight: "Popular for yoga and casual wear" },
    { name: "Sports Bras", share: "20%", insight: "Supportive athletic bras" },
    { name: "Athletic Shorts", share: "15%", insight: "Comfortable shorts for workouts" },
    { name: "Outerwear", share: "15%", insight: "Jackets and hoodies for active lifestyles" },
    { name: "Accessories", share: "10%", insight: "Headbands, bags, and yoga mats" },
  ],
  };
  
  const topCountries = {
	AAPL: [
	  { country: "United States", revenueShare: "42%" },
	  { country: "China", revenueShare: "18%" },
	  { country: "Japan", revenueShare: "8%" },
	  { country: "United Kingdom", revenueShare: "6%" },
	  { country: "Germany", revenueShare: "5%" },
	],
	MSFT: [
	  { country: "United States", revenueShare: "50%" },
	  { country: "China", revenueShare: "10%" },
	  { country: "Germany", revenueShare: "7%" },
	  { country: "Japan", revenueShare: "6%" },
	  { country: "United Kingdom", revenueShare: "5%" },
	],
	GOOG: [
	  { country: "United States", revenueShare: "44%" },
	  { country: "Japan", revenueShare: "10%" },
	  { country: "Germany", revenueShare: "6%" },
	  { country: "United Kingdom", revenueShare: "8%" },
	  { country: "South Korea", revenueShare: "5%" },
	],
	INFY: [
	  { country: "United States", revenueShare: "60%" },
	  { country: "India", revenueShare: "15%" },
	  { country: "Europe", revenueShare: "10%" },
	  { country: "Australia", revenueShare: "5%" },
	  { country: "Canada", revenueShare: "4%" },
	],
	TSLA: [
	  // Add Tesla top countries as per available data
	  { country: "United States", revenueShare: "70%" },
	  { country: "China", revenueShare: "15%" },
	  { country: "Norway", revenueShare: "5%" },
	  { country: "Netherlands", revenueShare: "4%" },
	  { country: "Germany", revenueShare: "3%" },
	],
	SAMSUNG: [
	  // Add Samsung top countries as per available data
	  { country: "South Korea", revenueShare: "30%" },
	  { country: "United States", revenueShare: "20%" },
	  { country: "India", revenueShare: "15%" },
	  { country: "Vietnam", revenueShare: "10%" },
	  { country: "Brazil", revenueShare: "5%" },
	],
	COCACOLA: [
	  // Add Coca-Cola top countries as per available data
	  { country: "United States", revenueShare: "50%" },
	  { country: "Mexico", revenueShare: "10%" },
	  { country: "China", revenueShare: "8%" },
	  { country: "Brazil", revenueShare: "7%" },
	  { country: "Japan", revenueShare: "5%" },
	],
	ADBE: [
	  // Add Adobe top countries as per available data
	  { country: "United States", revenueShare: "65%" },
	  { country: "Germany", revenueShare: "10%" },
	  { country: "United Kingdom", revenueShare: "8%" },
	  { country: "Japan", revenueShare: "7%" },
	  { country: "Australia", revenueShare: "5%" },
	],
  PEPSI: [
	  { country: "United States", revenueShare: "58%" },
	  { country: "Mexico", revenueShare: "10%" },
	  { country: "United Kingdom", revenueShare: "7%" },
	  { country: "China", revenueShare: "6%" },
	  { country: "Canada", revenueShare: "5%" },
  ],
  MCD: [
	  { country: "United States", revenueShare: "35%" },
	  { country: "France", revenueShare: "10%" },
	  { country: "United Kingdom", revenueShare: "9%" },
	  { country: "Germany", revenueShare: "8%" },
	  { country: "China", revenueShare: "6%" },
  ],
  TCS: [
	  { country: "United States", revenueShare: "50%" },
	  { country: "United Kingdom", revenueShare: "15%" },
	  { country: "India", revenueShare: "14%" },
	  { country: "Germany", revenueShare: "7%" },
	  { country: "Canada", revenueShare: "5%" },
  ],
  ALIBABA: [
	{ country: "China", revenueShare: "55%" },  
	{ country: "United States", revenueShare: "15%" }, 
	{ country: "Southeast Asia (combined)", revenueShare: "12%" },  
	{ country: "Europe (combined)", revenueShare: "10%" },  
	{ country: "Other", revenueShare: "8%" }, 
  ],
  HDFC: [
	  { country: "India", revenueShare: "94%" },
	  { country: "United Arab Emirates", revenueShare: "3%" },
	  { country: "United Kingdom", revenueShare: "2%" },
	  { country: "United States", revenueShare: "1%" },
  ],
  UBER: [
	  { country: "United States", revenueShare: "44%" },
	  { country: "Brazil", revenueShare: "11%" },
	  { country: "Canada", revenueShare: "8%" },
	  { country: "United Kingdom", revenueShare: "7%" },
	  { country: "France", revenueShare: "6%" },
  ],
  OLA: [
	  { country: "India", revenueShare: "97%" },
	  { country: "Australia", revenueShare: "2%" },
	  { country: "New Zealand", revenueShare: "1%" },
  ],
  DIOR: [
	  { country: "China", revenueShare: "36%" },
	  { country: "United States", revenueShare: "21%" },
	  { country: "France", revenueShare: "13%" },
	  { country: "Japan", revenueShare: "10%" },
	  { country: "United Kingdom", revenueShare: "6%" },
  ],
  GUCCI: [
	  { country: "United States", revenueShare: "33%" },
	  { country: "China", revenueShare: "22%" },
	  { country: "Italy", revenueShare: "8%" },
	  { country: "Japan", revenueShare: "7%" },
	  { country: "France", revenueShare: "6%" },
  ],
  INTC: [
	  { country: "United States", revenueShare: "48%" },
	  { country: "China", revenueShare: "21%" },
	  { country: "Taiwan", revenueShare: "11%" },
	  { country: "South Korea", revenueShare: "8%" },
	  { country: "Japan", revenueShare: "7%" },
  ],
  NIKE: [
	  { country: "United States", revenueShare: "39%" },
	  { country: "China", revenueShare: "18%" },
	  { country: "Japan", revenueShare: "7%" },
	  { country: "Germany", revenueShare: "6%" },
	  { country: "United Kingdom", revenueShare: "5%" },
  ],
  BOEING: [
	  { country: "United States", revenueShare: "44%" },
	  { country: "China", revenueShare: "19%" },
	  { country: "France", revenueShare: "11%" },
	  { country: "Germany", revenueShare: "8%" },
	  { country: "United Kingdom", revenueShare: "5%" },
  ],
  SONY: [
	  { country: "United States", revenueShare: "31%" },
	  { country: "Japan", revenueShare: "21%" },
	  { country: "China", revenueShare: "14%" },
	  { country: "Germany", revenueShare: "9%" },
	  { country: "United Kingdom", revenueShare: "8%" },
  ],
  ICICI: [
	  { country: "India", revenueShare: "91%" },
	  { country: "United Arab Emirates", revenueShare: "4%" },
	  { country: "United Kingdom", revenueShare: "3%" },
	  { country: "United States", revenueShare: "2%" },
  ],
  HP: [
	  { country: "United States", revenueShare: "40%" },
	  { country: "China", revenueShare: "15%" },
	  { country: "Japan", revenueShare: "10%" },
	  { country: "Germany", revenueShare: "9%" },
	  { country: "United Kingdom", revenueShare: "7%" },
  ],
  DELL: [
	  { country: "United States", revenueShare: "48%" },
	  { country: "China", revenueShare: "19%" },
	  { country: "Germany", revenueShare: "10%" },
	  { country: "Japan", revenueShare: "8%" },
	  { country: "United Kingdom", revenueShare: "5%" },
  ],
  STARBUCKS: [
	  { country: "United States", revenueShare: "45%" },
	  { country: "China", revenueShare: "20%" },
	  { country: "Canada", revenueShare: "8%" },
	  { country: "Japan", revenueShare: "7%" },
	  { country: "United Kingdom", revenueShare: "5%" },
  ],
  MITSUBISHI: [
	  { country: "Japan", revenueShare: "53%" },
	  { country: "United States", revenueShare: "14%" },
	  { country: "China", revenueShare: "11%" },
	  { country: "Germany", revenueShare: "8%" },
	  { country: "United Kingdom", revenueShare: "6%" },
  ],
  ADIDAS: [
	  { country: "United States", revenueShare: "23%" },
	  { country: "China", revenueShare: "21%" },
	  { country: "Germany", revenueShare: "17%" },
	  { country: "United Kingdom", revenueShare: "10%" },
	  { country: "France", revenueShare: "8%" },
  ],
  MERCEDES: [
	  { country: "China", revenueShare: "30%" },
	  { country: "United States", revenueShare: "18%" },
	  { country: "Germany", revenueShare: "15%" },
	  { country: "United Kingdom", revenueShare: "9%" },
	  { country: "France", revenueShare: "8%" },
   ],
   VOLKSWAGEN: [
    { country: "Germany", revenueShare: "58%" },
    { country: "Europe", revenueShare: "24%" },
    { country: "Asia-Pacific", revenueShare: "9%" },
    { country: "North America", revenueShare: "6%" },
    { country: "South America", revenueShare: "3%" },
  ],
  BOSE: [
    { country: "United States", revenueShare: "70%" },
    { country: "Europe", revenueShare: "15%" },
    { country: "Asia-Pacific", revenueShare: "10%" },
    { country: "Latin America", revenueShare: "5%" },
  ],
  DOMINOS: [
    { country: "United States", revenueShare: "95%" },
    { country: "International", revenueShare: "5%" },
  ],
  TACOBELL: [
    { country: "United States", revenueShare: "70%" },
    { country: "International", revenueShare: "30%" },
  ],
  KFC: [
    { country: "United States", revenueShare: "25%" },
    { country: "International", revenueShare: "75%" },
  ],
  AMAZON: [
    { country: "United States", revenueShare: "69%" },
    { country: "International", revenueShare: "31%" },
  ],
  EBAY: [
    { country: "United States", revenueShare: "48%" },
    { country: "International", revenueShare: "52%" },
  ],
  ETSY: [
    { country: "United States", revenueShare: "58%" },
    { country: "International", revenueShare: "42%" },
  ],
  SBI: [
    { country: "India", revenueShare: "100%" },
  ],
  FEDEX: [
    { country: "United States", revenueShare: "73%" },
    { country: "International", revenueShare: "27%" },
  ],
  BLUEDART: [
    { country: "India", revenueShare: "100%" },
  ],
  HUGOBOSS: [
    { country: "Germany", revenueShare: "52%" },
    { country: "Europe", revenueShare: "25%" },
    { country: "Asia-Pacific", revenueShare: "15%" },
    { country: "Americas", revenueShare: "8%" },
  ],
  LOUISVUITTON: [
    { country: "France", revenueShare: "100%" },
  ],
  AIRBUS: [
    { country: "Europe", revenueShare: "100%" },
  ],
  LOCKHEEDMARTIN: [
    { country: "United States", revenueShare: "100%" },
  ],
  SPICEJET: [
    { country: "India", revenueShare: "100%" },
  ],
  UNDERARMOUR: [
    { country: "United States", revenueShare: "100%" },
  ],
  LULULEMON: [
    { country: "Canada", revenueShare: "60%" },
    { country: "United States", revenueShare: "40%" },
  ],
  };
  
  
  
const topCompetitors = {
	AAPL: [
	  { symbol: "AAPL", name: "Apple Inc.", marketShare: "45%", customerRating: "4.7", pricePoint: "High", financialHealth: "Excellent" },
	  { symbol: "SSNLF", name: "Samsung Electronics", marketShare: "20%", customerRating: "4.5", pricePoint: "Medium", financialHealth: "Good" },
	  { symbol: "HUAWEI", name: "Huawei", marketShare: "10%", customerRating: "4.3", pricePoint: "Medium", financialHealth: "Fair" },
	  { symbol: "XIACF", name: "Xiaomi", marketShare: "8%", customerRating: "4.2", pricePoint: "Low", financialHealth: "Good" },
	  { symbol: "SONY", name: "Sony", marketShare: "5%", customerRating: "4.1", pricePoint: "High", financialHealth: "Fair" },
	],
	MSFT: [
	  { symbol: "MSFT", name: "Microsoft Corporation", marketShare: "30%", customerRating: "4.8", pricePoint: "High", financialHealth: "Excellent" },
	  { symbol: "AMZN", name: "Amazon Web Services (AWS)", marketShare: "20%", customerRating: "4.6", pricePoint: "High", financialHealth: "Excellent" },
	  { symbol: "GOOGL", name: "Google Cloud", marketShare: "15%", customerRating: "4.5", pricePoint: "Medium", financialHealth: "Good" },
	  { symbol: "IBM", name: "IBM", marketShare: "10%", customerRating: "4.2", pricePoint: "Medium", financialHealth: "Fair" },
	  { symbol: "CRM", name: "Salesforce", marketShare: "5%", customerRating: "4.4", pricePoint: "High", financialHealth: "Good" },
	],
	GOOG: [
	  { symbol: "GOOGL", name: "Alphabet Inc. (Google)", marketShare: "40%", customerRating: "4.9", pricePoint: "High", financialHealth: "Excellent" },
	  { symbol: "META", name: "Facebook (Meta)", marketShare: "20%", customerRating: "4.7", pricePoint: "Medium", financialHealth: "Good" },
	  { symbol: "AMZN", name: "Amazon", marketShare: "15%", customerRating: "4.6", pricePoint: "Medium", financialHealth: "Excellent" },
	  { symbol: "MSFT", name: "Microsoft", marketShare: "10%", customerRating: "4.5", pricePoint: "High", financialHealth: "Excellent" },
	  { symbol: "AAPL", name: "Apple", marketShare: "5%", customerRating: "4.4", pricePoint: "High", financialHealth: "Good" },
	],
	INFY: [
	  { symbol: "TCS", name: "Tata Consultancy Services", marketShare: "25%", customerRating: "4.6", pricePoint: "High", financialHealth: "Excellent" },
	  { symbol: "INFY", name: "Infosys", marketShare: "20%", customerRating: "4.5", pricePoint: "Medium", financialHealth: "Good" },
	  { symbol: "WIPRO", name: "Wipro Limited", marketShare: "15%", customerRating: "4.4", pricePoint: "Medium", financialHealth: "Good" },
	  { symbol: "HCLTECH", name: "HCL Technologies", marketShare: "10%", customerRating: "4.3", pricePoint: "Medium", financialHealth: "Good" },
	  { symbol: "COGNIZANT", name: "Cognizant Technology Solutions", marketShare: "10%", customerRating: "4.2", pricePoint: "Medium", financialHealth: "Fair" },
	],
	TSLA: [
	  // Add Tesla top competitors as per available data
	  { symbol: "GM", name: "General Motors", marketShare: "15%", customerRating: "4.2", pricePoint: "Medium", financialHealth: "Good" },
	  { symbol: "F", name: "Ford Motor Company", marketShare: "10%", customerRating: "4.1", pricePoint: "Medium", financialHealth: "Fair" },
	  { symbol: "NIO", name: "NIO Inc.", marketShare: "8%", customerRating: "4.0", pricePoint: "Medium", financialHealth: "Good" },
	  { symbol: "RIVN", name: "Rivian Automotive", marketShare: "5%", customerRating: "3.9", pricePoint: "Low", financialHealth: "Good" },
	  { symbol: "VWAGY", name: "Volkswagen AG", marketShare: "4%", customerRating: "4.0", pricePoint: "Medium", financialHealth: "Good" },
	],
	SAMSUNG: [
	  // Add Samsung top competitors as per available data
	  { symbol: "AAPL", name: "Apple Inc.", marketShare: "20%", customerRating: "4.4", pricePoint: "High", financialHealth: "Good" },
	  { symbol: "HUAWEI", name: "Huawei", marketShare: "15%", customerRating: "4.3", pricePoint: "Medium", financialHealth: "Fair" },
	  { symbol: "XIAOMI", name: "Xiaomi Corporation", marketShare: "10%", customerRating: "4.2", pricePoint: "Medium", financialHealth: "Good" },
	  { symbol: "SONY", name: "Sony Group Corporation", marketShare: "8%", customerRating: "4.1", pricePoint: "High", financialHealth: "Fair" },
	  { symbol: "LG", name: "LG Electronics Inc.", marketShare: "5%", customerRating: "4.0", pricePoint: "Medium", financialHealth: "Good" },
	],
	COCACOLA: [
	  // Add Coca-Cola top competitors as per available data
	  { symbol: "PEP", name: "PepsiCo, Inc.", marketShare: "30%", customerRating: "4.5", pricePoint: "Medium", financialHealth: "Excellent" },
	  { symbol: "DPSG", name: "Dr Pepper Snapple Group", marketShare: "10%", customerRating: "4.2", pricePoint: "Medium", financialHealth: "Good" },
	  { symbol: "KO", name: "The Coca-Cola Company", marketShare: "10%", customerRating: "4.3", pricePoint: "Medium", financialHealth: "Excellent" },
	  { symbol: "FIZZ", name: "National Beverage Corp.", marketShare: "5%", customerRating: "4.1", pricePoint: "Medium", financialHealth: "Good" },
	  { symbol: "MNST", name: "Monster Beverage Corporation", marketShare: "5%", customerRating: "4.0", pricePoint: "Medium", financialHealth: "Good" },
	],
	ADBE: [
	  // Add Adobe top competitors as per available data
	  { symbol: "MSFT", name: "Microsoft Corporation", marketShare: "25%", customerRating: "4.6", pricePoint: "High", financialHealth: "Excellent" },
	  { symbol: "CRM", name: "Salesforce", marketShare: "20%", customerRating: "4.5", pricePoint: "Medium", financialHealth: "Good" },
	  { symbol: "INTU", name: "Intuit Inc.", marketShare: "10%", customerRating: "4.3", pricePoint: "Medium", financialHealth: "Good" },
	  { symbol: "ORCL", name: "Oracle Corporation", marketShare: "10%", customerRating: "4.2", pricePoint: "Medium", financialHealth: "Good" },
	  { symbol: "SAP", name: "SAP SE", marketShare: "8%", customerRating: "4.1", pricePoint: "Medium", financialHealth: "Good" },
	],

	VOLKSWAGEN: [
		{ symbol: "VWAGY", name: "Volkswagen AG", marketShare: "10%", customerRating: "4.4", pricePoint: "Medium", financialHealth: "Good" },
		{ symbol: "BMWYY", name: "Bayerische Motoren Werke AG", marketShare: "8%", customerRating: "4.3", pricePoint: "High", financialHealth: "Excellent" },
		{ symbol: "DDAIF", name: "Daimler AG", marketShare: "7%", customerRating: "4.2", pricePoint: "Medium", financialHealth: "Good" },
		{ symbol: "GM", name: "General Motors", marketShare: "6%", customerRating: "4.1", pricePoint: "High", financialHealth: "Fair" },
		{ symbol: "F", name: "Ford Motor Company", marketShare: "5%", customerRating: "4.0", pricePoint: "Medium", financialHealth: "Good" },
	  ],
	  BOSE: [
		{ symbol: "BOSE", name: "Bose Corporation", marketShare: "15%", customerRating: "4.6", pricePoint: "High", financialHealth: "Excellent" },
		{ symbol: "SONO", name: "Sonos Inc.", marketShare: "10%", customerRating: "4.4", pricePoint: "Medium", financialHealth: "Good" },
		{ symbol: "HARMAN", name: "Harman International", marketShare: "8%", customerRating: "4.3", pricePoint: "Medium", financialHealth: "Fair" },
		{ symbol: "PION", name: "Pioneer Corporation", marketShare: "6%", customerRating: "4.1", pricePoint: "High", financialHealth: "Good" },
		{ symbol: "JBL", name: "JBL", marketShare: "5%", customerRating: "4.0", pricePoint: "Low", financialHealth: "Fair" },
	  ],
	  DOMINOS: [
		{ symbol: "DPZ", name: "Domino's Pizza Inc.", marketShare: "12%", customerRating: "4.5", pricePoint: "Medium", financialHealth: "Excellent" },
		{ symbol: "PZZA", name: "Papa John's International", marketShare: "8%", customerRating: "4.3", pricePoint: "Medium", financialHealth: "Good" },
		{ symbol: "YUM", name: "Yum! Brands Inc.", marketShare: "10%", customerRating: "4.4", pricePoint: "High", financialHealth: "Fair" },
		{ symbol: "CMG", name: "Chipotle Mexican Grill", marketShare: "6%", customerRating: "4.1", pricePoint: "High", financialHealth: "Good" },
		{ symbol: "MCD", name: "McDonald's Corporation", marketShare: "15%", customerRating: "4.6", pricePoint: "High", financialHealth: "Excellent" },
	  ],
	  TACOBELL: [
		{ symbol: "YUM", name: "Yum! Brands Inc.", marketShare: "10%", customerRating: "4.4", pricePoint: "High", financialHealth: "Fair" },
		{ symbol: "CMG", name: "Chipotle Mexican Grill", marketShare: "6%", customerRating: "4.1", pricePoint: "High", financialHealth: "Good" },
		{ symbol: "MCD", name: "McDonald's Corporation", marketShare: "15%", customerRating: "4.6", pricePoint: "High", financialHealth: "Excellent" },
		{ symbol: "PZZA", name: "Papa John's International", marketShare: "8%", customerRating: "4.3", pricePoint: "Medium", financialHealth: "Good" },
		{ symbol: "DPZ", name: "Domino's Pizza Inc.", marketShare: "12%", customerRating: "4.5", pricePoint: "Medium", financialHealth: "Excellent" },
	  ],
	  KFC: [
		{ symbol: "YUM", name: "Yum! Brands Inc.", marketShare: "10%", customerRating: "4.4", pricePoint: "High", financialHealth: "Fair" },
		{ symbol: "CMG", name: "Chipotle Mexican Grill", marketShare: "6%", customerRating: "4.1", pricePoint: "High", financialHealth: "Good" },
		{ symbol: "MCD", name: "McDonald's Corporation", marketShare: "15%", customerRating: "4.6", pricePoint: "High", financialHealth: "Excellent" },
		{ symbol: "PZZA", name: "Papa John's International", marketShare: "8%", customerRating: "4.3", pricePoint: "Medium", financialHealth: "Good" },
		{ symbol: "DPZ", name: "Domino's Pizza Inc.", marketShare: "12%", customerRating: "4.5", pricePoint: "Medium", financialHealth: "Excellent" },
	  ],
	  AMAZON: [
		{ symbol: "AMZN", name: "Amazon.com Inc.", marketShare: "50%", customerRating: "4.8", pricePoint: "High", financialHealth: "Excellent" },
		{ symbol: "WMT", name: "Walmart Inc.", marketShare: "20%", customerRating: "4.5", pricePoint: "Medium", financialHealth: "Good" },
		{ symbol: "TGT", name: "Target Corporation", marketShare: "10%", customerRating: "4.3", pricePoint: "Medium", financialHealth: "Good" },
		{ symbol: "COST", name: "Costco Wholesale Corporation", marketShare: "8%", customerRating: "4.2", pricePoint: "High", financialHealth: "Excellent" },
		{ symbol: "HD", name: "The Home Depot Inc.", marketShare: "5%", customerRating: "4.1", pricePoint: "High", financialHealth: "Good" },
	  ],
	  EBAY: [
		{ symbol: "EBAY", name: "eBay Inc.", marketShare: "15%", customerRating: "4.6", pricePoint: "Medium", financialHealth: "Excellent" },
		{ symbol: "ETSY", name: "Etsy Inc.", marketShare: "10%", customerRating: "4.4", pricePoint: "Medium", financialHealth: "Good" },
		{ symbol: "AMZN", name: "Amazon.com Inc.", marketShare: "50%", customerRating: "4.8", pricePoint: "High", financialHealth: "Excellent" },
		{ symbol: "WMT", name: "Walmart Inc.", marketShare: "20%", customerRating: "4.5", pricePoint: "Medium", financialHealth: "Good" },
		{ symbol: "TGT", name: "Target Corporation", marketShare: "10%", customerRating: "4.3", pricePoint: "Medium", financialHealth: "Good" },
	  ],
	  ETSY: [
		{ symbol: "ETSY", name: "Etsy Inc.", marketShare: "10%", customerRating: "4.4", pricePoint: "Medium", financialHealth: "Good" },
		{ symbol: "EBAY", name: "eBay Inc.", marketShare: "15%", customerRating: "4.6", pricePoint: "Medium", financialHealth: "Excellent" },
		{ symbol: "AMZN", name: "Amazon.com Inc.", marketShare: "50%", customerRating: "4.8", pricePoint: "High", financialHealth: "Excellent" },
		{ symbol: "WMT", name: "Walmart Inc.", marketShare: "20%", customerRating: "4.5", pricePoint: "Medium", financialHealth: "Good" },
		{ symbol: "TGT", name: "Target Corporation", marketShare: "10%", customerRating: "4.3", pricePoint: "Medium", financialHealth: "Good" },
	  ],
	  SBI: [
		{ symbol: "SBIN", name: "State Bank of India", marketShare: "25%", customerRating: "4.5", pricePoint: "High", financialHealth: "Excellent" },
		{ symbol: "HDFCBANK", name: "HDFC Bank", marketShare: "15%", customerRating: "4.3", pricePoint: "High", financialHealth: "Good" },
		{ symbol: "ICICIBANK", name: "ICICI Bank", marketShare: "12%", customerRating: "4.2", pricePoint: "Medium", financialHealth: "Good" },
		{ symbol: "AXISBANK", name: "Axis Bank", marketShare: "10%", customerRating: "4.1", pricePoint: "Medium", financialHealth: "Fair" },
		{ symbol: "KOTAKBANK", name: "Kotak Mahindra Bank", marketShare: "8%", customerRating: "4.0", pricePoint: "High", financialHealth: "Good" },
	  ],
	  FEDEX: [
		{ symbol: "FDX", name: "FedEx Corporation", marketShare: "20%", customerRating: "4.6", pricePoint: "High", financialHealth: "Excellent" },
		{ symbol: "UPS", name: "United Parcel Service Inc.", marketShare: "15%", customerRating: "4.5", pricePoint: "Medium", financialHealth: "Good" },
		{ symbol: "DHL", name: "DHL International GmbH", marketShare: "10%", customerRating: "4.3", pricePoint: "Medium", financialHealth: "Good" },
		{ symbol: "TNT", name: "TNT Holdings B.V.", marketShare: "8%", customerRating: "4.2", pricePoint: "High", financialHealth: "Fair" },
		{ symbol: "USPS", name: "United States Postal Service", marketShare: "5%", customerRating: "4.0", pricePoint: "Low", financialHealth: "Good" },
	  ],
	  BLUEDART: [
		{ symbol: "BLUEDART", name: "Blue Dart Express Limited", marketShare: "12%", customerRating: "4.5", pricePoint: "Medium", financialHealth: "Excellent" },
		{ symbol: "ARAMEX", name: "Aramex", marketShare: "8%", customerRating: "4.3", pricePoint: "Medium", financialHealth: "Good" },
		{ symbol: "DTDC", name: "DTDC Express Limited", marketShare: "10%", customerRating: "4.4", pricePoint: "High", financialHealth: "Fair" },
		{ symbol: "GATI", name: "Gati Limited", marketShare: "6%", customerRating: "4.1", pricePoint: "High", financialHealth: "Good" },
		{ symbol: "INDIAP", name: "India Post", marketShare: "15%", customerRating: "4.6", pricePoint: "High", financialHealth: "Excellent" },
	  ],
	  HUGOBOSS: [
		{ symbol: "BOSSY", name: "Hugo Boss AG", marketShare: "10%", customerRating: "4.4", pricePoint: "Medium", financialHealth: "Good" },
		{ symbol: "ZARA", name: "Inditex", marketShare: "15%", customerRating: "4.6", pricePoint: "High", financialHealth: "Excellent" },
		{ symbol: "PRADA", name: "Prada", marketShare: "8%", customerRating: "4.3", pricePoint: "Medium", financialHealth: "Good" },
		{ symbol: "GAP", name: "Gap Inc.", marketShare: "5%", customerRating: "4.1", pricePoint: "High", financialHealth: "Fair" },
		{ symbol: "LVMH", name: "LVMH Moët Hennessy Louis Vuitton", marketShare: "12%", customerRating: "4.5", pricePoint: "Medium", financialHealth: "Good" },
	  ],
	  LOUISVUITTON: [
		{ symbol: "LVMH", name: "LVMH Moët Hennessy Louis Vuitton", marketShare: "12%", customerRating: "4.5", pricePoint: "Medium", financialHealth: "Good" },
		{ symbol: "KORS", name: "Michael Kors Holdings", marketShare: "8%", customerRating: "4.3", pricePoint: "Medium", financialHealth: "Fair" },
		{ symbol: "COH", name: "Tapestry Inc.", marketShare: "10%", customerRating: "4.4", pricePoint: "High", financialHealth: "Excellent" },
		{ symbol: "TIF", name: "Tiffany & Co.", marketShare: "6%", customerRating: "4.1", pricePoint: "High", financialHealth: "Good" },
		{ symbol: "BURBY", name: "Burberry Group plc", marketShare: "15%", customerRating: "4.6", pricePoint: "High", financialHealth: "Excellent" },
	  ],
	  AIRBUS: [
		{ symbol: "AIR.PA", name: "Airbus SE", marketShare: "15%", customerRating: "4.6", pricePoint: "High", financialHealth: "Excellent" },
		{ symbol: "BA", name: "The Boeing Company", marketShare: "20%", customerRating: "4.7", pricePoint: "High", financialHealth: "Good" },
		{ symbol: "LMT", name: "Lockheed Martin Corporation", marketShare: "10%", customerRating: "4.4", pricePoint: "Medium", financialHealth: "Good" },
		{ symbol: "RTN", name: "Raytheon Technologies Corporation", marketShare: "8%", customerRating: "4.3", pricePoint: "Medium", financialHealth: "Fair" },
		{ symbol: "GE", name: "General Electric Company", marketShare: "5%", customerRating: "4.1", pricePoint: "High", financialHealth: "Good" },
	  ],
	  LOCKHEEDMARTIN: [
		{ symbol: "LMT", name: "Lockheed Martin Corporation", marketShare: "10%", customerRating: "4.4", pricePoint: "Medium", financialHealth: "Good" },
		{ symbol: "BA", name: "The Boeing Company", marketShare: "20%", customerRating: "4.7", pricePoint: "High", financialHealth: "Good" },
		{ symbol: "AIR.PA", name: "Airbus SE", marketShare: "15%", customerRating: "4.6", pricePoint: "High", financialHealth: "Excellent" },
		{ symbol: "RTN", name: "Raytheon Technologies Corporation", marketShare: "8%", customerRating: "4.3", pricePoint: "Medium", financialHealth: "Fair" },
		{ symbol: "GD", name: "General Dynamics Corporation", marketShare: "5%", customerRating: "4.1", pricePoint: "High", financialHealth: "Good" },
	  ],
	  SPICEJET: [
		{ symbol: "SPICEJET", name: "SpiceJet Ltd.", marketShare: "12%", customerRating: "4.5", pricePoint: "Medium", financialHealth: "Excellent" },
		{ symbol: "INDIGO", name: "InterGlobe Aviation Ltd.", marketShare: "10%", customerRating: "4.4", pricePoint: "Medium", financialHealth: "Good" },
		{ symbol: "JETAIRWAYS", name: "Jet Airways (India) Ltd.", marketShare: "8%", customerRating: "4.3", pricePoint: "Medium", financialHealth: "Good" },
		{ symbol: "AIRINDIA", name: "Air India", marketShare: "6%", customerRating: "4.1", pricePoint: "High", financialHealth: "Fair" },
		{ symbol: "GOAIR", name: "GoAir", marketShare: "5%", customerRating: "4.0", pricePoint: "Low", financialHealth: "Good" },
	  ],
	  UNDERARMOUR: [
		{ symbol: "UAA", name: "Under Armour Inc.", marketShare: "10%", customerRating: "4.4", pricePoint: "Medium", financialHealth: "Good" },
		{ symbol: "NKE", name: "Nike Inc.", marketShare: "15%", customerRating: "4.6", pricePoint: "High", financialHealth: "Excellent" },
		{ symbol: "ADIDAS", name: "Adidas AG", marketShare: "12%", customerRating: "4.5", pricePoint: "Medium", financialHealth: "Good" },
		{ symbol: "PUMA", name: "Puma SE", marketShare: "8%", customerRating: "4.3", pricePoint: "Medium", financialHealth: "Fair" },
		{ symbol: "ASICS", name: "ASICS Corporation", marketShare: "5%", customerRating: "4.1", pricePoint: "High", financialHealth: "Good" },
	  ],
	  LULULEMON: [
		{ symbol: "LULU", name: "Lululemon Athletica Inc.", marketShare: "12%", customerRating: "4.5", pricePoint: "Medium", financialHealth: "Excellent" },
		{ symbol: "NKE", name: "Nike Inc.", marketShare: "15%", customerRating: "4.6", pricePoint: "High", financialHealth: "Excellent" },
		{ symbol: "UAA", name: "Under Armour Inc.", marketShare: "10%", customerRating: "4.4", pricePoint: "Medium", financialHealth: "Good" },
		{ symbol: "ADDYY", name: "Adidas AG", marketShare: "12%", customerRating: "4.5", pricePoint: "Medium", financialHealth: "Good" },
		{ symbol: "PVH", name: "PVH Corp.", marketShare: "8%", customerRating: "4.3", pricePoint: "Medium", financialHealth: "Fair" },
	  ],
	
  };
  
  const quarterlyResults = {
	AAPL: [
	  { quarter: 'Q1 2023', revenue: '+$18B', expenses: '-$14B', profitBeforeTax: '+$4B', netProfit: '+$3B', changeFromPrevious: '+2%' },
	  { quarter: 'Q2 2023', revenue: '+$19B', expenses: '-$15B', profitBeforeTax: '+$4.5B', netProfit: '+$3.5B', changeFromPrevious: '+5%' },
	  { quarter: 'Q3 2023', revenue: '+$21B', expenses: '-$16B', profitBeforeTax: '+$5B', netProfit: '+$4B', changeFromPrevious: '+5%' },
	  { quarter: 'Q4 2023', revenue: '+$23B', expenses: '-$17B', profitBeforeTax: '+$5.5B', netProfit: '+$4.5B', changeFromPrevious: '+10%' },
	  { quarter: 'Q1 2024', revenue: '+$20B', expenses: '-$15B', profitBeforeTax: '+$5B', netProfit: '+$4B', changeFromPrevious: '+2%' },
	  { quarter: 'Q2 2024', revenue: '+$22B', expenses: '-$16B', profitBeforeTax: '+$6B', netProfit: '+$4.5B', changeFromPrevious: '+10%' },
	  { quarter: 'Q3 2024', revenue: '+$24B', expenses: '-$18B', profitBeforeTax: '+$6B', netProfit: '+$5B', changeFromPrevious: '+5%' },
	  { quarter: 'Q4 2024', revenue: '+$26B', expenses: '-$20B', profitBeforeTax: '+$7B', netProfit: '+$5.5B', changeFromPrevious: '+10%' },
	],
	MSFT: [
	  { quarter: 'Q1 2023', revenue: '+$25B', expenses: '-$18B', profitBeforeTax: '+$7B', netProfit: '+$5B', changeFromPrevious: null },
	  { quarter: 'Q2 2023', revenue: '+$26B', expenses: '-$19B', profitBeforeTax: '+$7.5B', netProfit: '+$5.5B', changeFromPrevious: '+5%' },
	  { quarter: 'Q3 2023', revenue: '+$28B', expenses: '-$20B', profitBeforeTax: '+$8B', netProfit: '+$6B', changeFromPrevious: '+6%' },
	  { quarter: 'Q4 2023', revenue: '+$30B', expenses: '-$21B', profitBeforeTax: '+$9B', netProfit: '+$7B', changeFromPrevious: '+10%' },
	  { quarter: 'Q1 2024', revenue: '+$30B', expenses: '-$20B', profitBeforeTax: '+$10B', netProfit: '+$8B', changeFromPrevious: null },
	  { quarter: 'Q2 2024', revenue: '+$32B', expenses: '-$22B', profitBeforeTax: '+$10B', netProfit: '+$8.5B', changeFromPrevious: '+5%' },
	  { quarter: 'Q3 2024', revenue: '+$34B', expenses: '-$24B', profitBeforeTax: '+$10B', netProfit: '+$9B', changeFromPrevious: '+6%' },
	  { quarter: 'Q4 2024', revenue: '+$36B', expenses: '-$25B', profitBeforeTax: '+$12B', netProfit: '+$10B', changeFromPrevious: '+10%' },
	],
	GOOG: [
	  { quarter: 'Q1 2023', revenue: '+$20B', expenses: '-$15B', profitBeforeTax: '+$6B', netProfit: '+$5B', changeFromPrevious: null },
	  { quarter: 'Q2 2023', revenue: '+$22B', expenses: '-$16B', profitBeforeTax: '+$6.5B', netProfit: '+$5.5B', changeFromPrevious: '+5%' },
	  { quarter: 'Q3 2023', revenue: '+$24B', expenses: '-$17B', profitBeforeTax: '+$7B', netProfit: '+$6B', changeFromPrevious: '+5%' },
	  { quarter: 'Q4 2023', revenue: '+$26B', expenses: '-$18B', profitBeforeTax: '+$7.5B', netProfit: '+$6.5B', changeFromPrevious: '+10%' },
	  { quarter: 'Q1 2024', revenue: '+$25B', expenses: '-$18B', profitBeforeTax: '+$7B', netProfit: '+$6B', changeFromPrevious: null },
	  { quarter: 'Q2 2024', revenue: '+$27B', expenses: '-$20B', profitBeforeTax: '+$7B', netProfit: '+$6.5B', changeFromPrevious: '+3%' },
	  { quarter: 'Q3 2024', revenue: '+$30B', expenses: '-$22B', profitBeforeTax: '+$8B', netProfit: '+$7B', changeFromPrevious: '+5%' },
	  { quarter: 'Q4 2024', revenue: '+$32B', expenses: '-$24B', profitBeforeTax: '+$9B', netProfit: '+$7.5B', changeFromPrevious: '+6%' },
	],
	INFY: [
	  { quarter: 'Q1 2023', revenue: '+$20B', expenses: '-$15B', profitBeforeTax: '+$6B', netProfit: '+$5B', changeFromPrevious: null },
	  { quarter: 'Q2 2023', revenue: '+$22B', expenses: '-$16B', profitBeforeTax: '+$6.5B', netProfit: '+$5.5B', changeFromPrevious: '+5%' },
	  { quarter: 'Q3 2023', revenue: '+$24B', expenses: '-$17B', profitBeforeTax: '+$7B', netProfit: '+$6B', changeFromPrevious: '+5%' },
	  { quarter: 'Q4 2023', revenue: '+$26B', expenses: '-$18B', profitBeforeTax: '+$7.5B', netProfit: '+$6.5B', changeFromPrevious: '+10%' },
	  { quarter: 'Q1 2024', revenue: '+$25B', expenses: '-$18B', profitBeforeTax: '+$7B', netProfit: '+$6B', changeFromPrevious: null },
	  { quarter: 'Q2 2024', revenue: '+$27B', expenses: '-$20B', profitBeforeTax: '+$7B', netProfit: '+$6.5B', changeFromPrevious: '+3%' },
	  { quarter: 'Q3 2024', revenue: '+$30B', expenses: '-$22B', profitBeforeTax: '+$8B', netProfit: '+$7B', changeFromPrevious: '+5%' },
	  { quarter: 'Q4 2024', revenue: '+$32B', expenses: '-$24B', profitBeforeTax: '+$9B', netProfit: '+$7.5B', changeFromPrevious: '+6%' },
	],
	TSLA: [
	  { quarter: 'Q1 2023', revenue: '+$20B', expenses: '-$15B', profitBeforeTax: '+$6B', netProfit: '+$5B', changeFromPrevious: null },
	  { quarter: 'Q2 2023', revenue: '+$22B', expenses: '-$16B', profitBeforeTax: '+$6.5B', netProfit: '+$5.5B', changeFromPrevious: '+5%' },
	  { quarter: 'Q3 2023', revenue: '+$24B', expenses: '-$17B', profitBeforeTax: '+$7B', netProfit: '+$6B', changeFromPrevious: '+5%' },
	  { quarter: 'Q4 2023', revenue: '+$26B', expenses: '-$18B', profitBeforeTax: '+$7.5B', netProfit: '+$6.5B', changeFromPrevious: '+10%' },
	  { quarter: 'Q1 2024', revenue: '+$25B', expenses: '-$18B', profitBeforeTax: '+$7B', netProfit: '+$6B', changeFromPrevious: null },
	  { quarter: 'Q2 2024', revenue: '+$27B', expenses: '-$20B', profitBeforeTax: '+$7B', netProfit: '+$6.5B', changeFromPrevious: '+3%' },
	  { quarter: 'Q3 2024', revenue: '+$30B', expenses: '-$22B', profitBeforeTax: '+$8B', netProfit: '+$7B', changeFromPrevious: '+5%' },
	  { quarter: 'Q4 2024', revenue: '+$32B', expenses: '-$24B', profitBeforeTax: '+$9B', netProfit: '+$7.5B', changeFromPrevious: '+6%' },
	],
	SAMSUNG: [
	  { quarter: 'Q1 2023', revenue: '+$20B', expenses: '-$15B', profitBeforeTax: '+$6B', netProfit: '+$5B', changeFromPrevious: null },
	  { quarter: 'Q2 2023', revenue: '+$22B', expenses: '-$16B', profitBeforeTax: '+$6.5B', netProfit: '+$5.5B', changeFromPrevious: '+5%' },
	  { quarter: 'Q3 2023', revenue: '+$24B', expenses: '-$17B', profitBeforeTax: '+$7B', netProfit: '+$6B', changeFromPrevious: '+5%' },
	  { quarter: 'Q4 2023', revenue: '+$26B', expenses: '-$18B', profitBeforeTax: '+$7.5B', netProfit: '+$6.5B', changeFromPrevious: '+10%' },
	  { quarter: 'Q1 2024', revenue: '+$25B', expenses: '-$18B', profitBeforeTax: '+$7B', netProfit: '+$6B', changeFromPrevious: null },
	  { quarter: 'Q2 2024', revenue: '+$27B', expenses: '-$20B', profitBeforeTax: '+$7B', netProfit: '+$6.5B', changeFromPrevious: '+3%' },
	  { quarter: 'Q3 2024', revenue: '+$30B', expenses: '-$22B', profitBeforeTax: '+$8B', netProfit: '+$7B', changeFromPrevious: '+5%' },
	  { quarter: 'Q4 2024', revenue: '+$32B', expenses: '-$24B', profitBeforeTax: '+$9B', netProfit: '+$7.5B', changeFromPrevious: '+6%' },
	],
	COCACOLA: [
	  { quarter: 'Q1 2023', revenue: '+$20B', expenses: '-$15B', profitBeforeTax: '+$6B', netProfit: '+$5B', changeFromPrevious: null },
	  { quarter: 'Q2 2023', revenue: '+$22B', expenses: '-$16B', profitBeforeTax: '+$6.5B', netProfit: '+$5.5B', changeFromPrevious: '+5%' },
	  { quarter: 'Q3 2023', revenue: '+$24B', expenses: '-$17B', profitBeforeTax: '+$7B', netProfit: '+$6B', changeFromPrevious: '+5%' },
	  { quarter: 'Q4 2023', revenue: '+$26B', expenses: '-$18B', profitBeforeTax: '+$7.5B', netProfit: '+$6.5B', changeFromPrevious: '+10%' },
	  { quarter: 'Q1 2024', revenue: '+$25B', expenses: '-$18B', profitBeforeTax: '+$7B', netProfit: '+$6B', changeFromPrevious: null },
	  { quarter: 'Q2 2024', revenue: '+$27B', expenses: '-$20B', profitBeforeTax: '+$7B', netProfit: '+$6.5B', changeFromPrevious: '+3%' },
	  { quarter: 'Q3 2024', revenue: '+$30B', expenses: '-$22B', profitBeforeTax: '+$8B', netProfit: '+$7B', changeFromPrevious: '+5%' },
	  { quarter: 'Q4 2024', revenue: '+$32B', expenses: '-$24B', profitBeforeTax: '+$9B', netProfit: '+$7.5B', changeFromPrevious: '+6%' },
	],
	ADBE: [
	  { quarter: 'Q1 2023', revenue: '+$20B', expenses: '-$15B', profitBeforeTax: '+$6B', netProfit: '+$5B', changeFromPrevious: null },
	  { quarter: 'Q2 2023', revenue: '+$22B', expenses: '-$16B', profitBeforeTax: '+$6.5B', netProfit: '+$5.5B', changeFromPrevious: '+5%' },
	  { quarter: 'Q3 2023', revenue: '+$24B', expenses: '-$17B', profitBeforeTax: '+$7B', netProfit: '+$6B', changeFromPrevious: '+5%' },
	  { quarter: 'Q4 2023', revenue: '+$26B', expenses: '-$18B', profitBeforeTax: '+$7.5B', netProfit: '+$6.5B', changeFromPrevious: '+10%' },
	  { quarter: 'Q1 2024', revenue: '+$25B', expenses: '-$18B', profitBeforeTax: '+$7B', netProfit: '+$6B', changeFromPrevious: null },
	  { quarter: 'Q2 2024', revenue: '+$27B', expenses: '-$20B', profitBeforeTax: '+$7B', netProfit: '+$6.5B', changeFromPrevious: '+3%' },
	  { quarter: 'Q3 2024', revenue: '+$30B', expenses: '-$22B', profitBeforeTax: '+$8B', netProfit: '+$7B', changeFromPrevious: '+5%' },
	  { quarter: 'Q4 2024', revenue: '+$32B', expenses: '-$24B', profitBeforeTax: '+$9B', netProfit: '+$7.5B', changeFromPrevious: '+6%' },
	],
	  VOLKSWAGEN: [
    { quarter: 'Q1 2023', revenue: '+€20B', expenses: '-€15B', profitBeforeTax: '+€5B', netProfit: '+€4B', changeFromPrevious: '+3%' },
    { quarter: 'Q2 2023', revenue: '+€22B', expenses: '-€16B', profitBeforeTax: '+€6B', netProfit: '+€5B', changeFromPrevious: '+7%' },
    { quarter: 'Q3 2023', revenue: '+€24B', expenses: '-€18B', profitBeforeTax: '+€7B', netProfit: '+€6B', changeFromPrevious: '+6%' },
    { quarter: 'Q4 2023', revenue: '+€26B', expenses: '-€20B', profitBeforeTax: '+€8B', netProfit: '+€7B', changeFromPrevious: '+10%' },
    { quarter: 'Q1 2024', revenue: '+€25B', expenses: '-€19B', profitBeforeTax: '+€8B', netProfit: '+€7B', changeFromPrevious: '+4%' },
    { quarter: 'Q2 2024', revenue: '+€28B', expenses: '-€21B', profitBeforeTax: '+€9B', netProfit: '+€8B', changeFromPrevious: '+12%' },
    { quarter: 'Q3 2024', revenue: '+€30B', expenses: '-€23B', profitBeforeTax: '+€10B', netProfit: '+€9B', changeFromPrevious: '+7%' },
    { quarter: 'Q4 2024', revenue: '+€32B', expenses: '-€25B', profitBeforeTax: '+€11B', netProfit: '+€10B', changeFromPrevious: '+10%' },
  ],
  BOSE: [
    { quarter: 'Q1 2023', revenue: '+$3B', expenses: '-$2B', profitBeforeTax: '+$1B', netProfit: '+$0.8B', changeFromPrevious: '+4%' },
    { quarter: 'Q2 2023', revenue: '+$3.5B', expenses: '-$2.5B', profitBeforeTax: '+$1.2B', netProfit: '+$1B', changeFromPrevious: '+6%' },
    { quarter: 'Q3 2023', revenue: '+$3.8B', expenses: '-$2.8B', profitBeforeTax: '+$1.3B', netProfit: '+$1.1B', changeFromPrevious: '+7%' },
    { quarter: 'Q4 2023', revenue: '+$4B', expenses: '-$3B', profitBeforeTax: '+$1.5B', netProfit: '+$1.2B', changeFromPrevious: '+10%' },
    { quarter: 'Q1 2024', revenue: '+$4.2B', expenses: '-$3.2B', profitBeforeTax: '+$1.6B', netProfit: '+$1.3B', changeFromPrevious: '+3%' },
    { quarter: 'Q2 2024', revenue: '+$4.5B', expenses: '-$3.5B', profitBeforeTax: '+$1.8B', netProfit: '+$1.4B', changeFromPrevious: '+12%' },
    { quarter: 'Q3 2024', revenue: '+$4.8B', expenses: '-$3.8B', profitBeforeTax: '+$2B', netProfit: '+$1.6B', changeFromPrevious: '+8%' },
    { quarter: 'Q4 2024', revenue: '+$5B', expenses: '-$4B', profitBeforeTax: '+$2.2B', netProfit: '+$1.8B', changeFromPrevious: '+10%' },
  ],
  DOMINOS: [
    { quarter: 'Q1 2023', revenue: '+$2B', expenses: '-$1.5B', profitBeforeTax: '+$0.5B', netProfit: '+$0.4B', changeFromPrevious: '+2%' },
    { quarter: 'Q2 2023', revenue: '+$2.2B', expenses: '-$1.7B', profitBeforeTax: '+$0.6B', netProfit: '+$0.5B', changeFromPrevious: '+5%' },
    { quarter: 'Q3 2023', revenue: '+$2.4B', expenses: '-$1.8B', profitBeforeTax: '+$0.7B', netProfit: '+$0.6B', changeFromPrevious: '+5%' },
    { quarter: 'Q4 2023', revenue: '+$2.6B', expenses: '-$2B', profitBeforeTax: '+$0.8B', netProfit: '+$0.7B', changeFromPrevious: '+10%' },
    { quarter: 'Q1 2024', revenue: '+$2.8B', expenses: '-$2.2B', profitBeforeTax: '+$0.9B', netProfit: '+$0.8B', changeFromPrevious: '+2%' },
    { quarter: 'Q2 2024', revenue: '+$3B', expenses: '-$2.3B', profitBeforeTax: '+$1B', netProfit: '+$0.9B', changeFromPrevious: '+10%' },
    { quarter: 'Q3 2024', revenue: '+$3.2B', expenses: '-$2.5B', profitBeforeTax: '+$1.2B', netProfit: '+$1.1B', changeFromPrevious: '+5%' },
    { quarter: 'Q4 2024', revenue: '+$3.5B', expenses: '-$2.8B', profitBeforeTax: '+$1.4B', netProfit: '+$1.2B', changeFromPrevious: '+10%' },
  ],
  TACOBELL: [
    { quarter: 'Q1 2023', revenue: '+$4B', expenses: '-$3B', profitBeforeTax: '+$1B', netProfit: '+$0.8B', changeFromPrevious: '+3%' },
    { quarter: 'Q2 2023', revenue: '+$4.5B', expenses: '-$3.5B', profitBeforeTax: '+$1.2B', netProfit: '+$1B', changeFromPrevious: '+7%' },
    { quarter: 'Q3 2023', revenue: '+$5B', expenses: '-$4B', profitBeforeTax: '+$1.5B', netProfit: '+$1.2B', changeFromPrevious: '+6%' },
    { quarter: 'Q4 2023', revenue: '+$5.5B', expenses: '-$4.5B', profitBeforeTax: '+$1.8B', netProfit: '+$1.5B', changeFromPrevious: '+10%' },
    { quarter: 'Q1 2024', revenue: '+$6B', expenses: '-$5B', profitBeforeTax: '+$2B', netProfit: '+$1.7B', changeFromPrevious: '+4%' },
    { quarter: 'Q2 2024', revenue: '+$6.5B', expenses: '-$5.5B', profitBeforeTax: '+$2.2B', netProfit: '+$1.9B', changeFromPrevious: '+8%' },
    { quarter: 'Q3 2024', revenue: '+$7B', expenses: '-$6B', profitBeforeTax: '+$2.5B', netProfit: '+$2.2B', changeFromPrevious: '+7%' },
    { quarter: 'Q4 2024', revenue: '+$7.5B', expenses: '-$6.5B', profitBeforeTax: '+$2.8B', netProfit: '+$2.5B', changeFromPrevious: '+10%' },
  ],
  KFC: [
    { quarter: 'Q1 2023', revenue: '+$3B', expenses: '-$2B', profitBeforeTax: '+$1B', netProfit: '+$0.8B', changeFromPrevious: '+4%' },
    { quarter: 'Q2 2023', revenue: '+$3.5B', expenses: '-$2.5B', profitBeforeTax: '+$1.2B', netProfit: '+$1B', changeFromPrevious: '+6%' },
    { quarter: 'Q3 2023', revenue: '+$3.8B', expenses: '-$2.8B', profitBeforeTax: '+$1.3B', netProfit: '+$1.1B', changeFromPrevious: '+7%' },
    { quarter: 'Q4 2023', revenue: '+$4B', expenses: '-$3B', profitBeforeTax: '+$1.5B', netProfit: '+$1.2B', changeFromPrevious: '+10%' },
    { quarter: 'Q1 2024', revenue: '+$4.2B', expenses: '-$3.2B', profitBeforeTax: '+$1.6B', netProfit: '+$1.3B', changeFromPrevious: '+3%' },
    { quarter: 'Q2 2024', revenue: '+$4.5B', expenses: '-$3.5B', profitBeforeTax: '+$1.8B', netProfit: '+$1.4B', changeFromPrevious: '+12%' },
    { quarter: 'Q3 2024', revenue: '+$4.8B', expenses: '-$3.8B', profitBeforeTax: '+$2B', netProfit: '+$1.6B', changeFromPrevious: '+8%' },
    { quarter: 'Q4 2024', revenue: '+$5B', expenses: '-$4B', profitBeforeTax: '+$2.2B', netProfit: '+$1.8B', changeFromPrevious: '+10%' },
  ],
  AMAZON: [
    { quarter: 'Q1 2023', revenue: '+$40B', expenses: '-$30B', profitBeforeTax: '+$10B', netProfit: '+$8B', changeFromPrevious: '+5%' },
    { quarter: 'Q2 2023', revenue: '+$42B', expenses: '-$32B', profitBeforeTax: '+$11B', netProfit: '+$9B', changeFromPrevious: '+7%' },
    { quarter: 'Q3 2023', revenue: '+$45B', expenses: '-$35B', profitBeforeTax: '+$12B', netProfit: '+$10B', changeFromPrevious: '+6%' },
    { quarter: 'Q4 2023', revenue: '+$48B', expenses: '-$38B', profitBeforeTax: '+$13B', netProfit: '+$11B', changeFromPrevious: '+10%' },
    { quarter: 'Q1 2024', revenue: '+$46B', expenses: '-$36B', profitBeforeTax: '+$12B', netProfit: '+$10B', changeFromPrevious: '+3%' },
    { quarter: 'Q2 2024', revenue: '+$50B', expenses: '-$40B', profitBeforeTax: '+$14B', netProfit: '+$12B', changeFromPrevious: '+12%' },
    { quarter: 'Q3 2024', revenue: '+$52B', expenses: '-$42B', profitBeforeTax: '+$15B', netProfit: '+$13B', changeFromPrevious: '+7%' },
    { quarter: 'Q4 2024', revenue: '+$55B', expenses: '-$45B', profitBeforeTax: '+$16B', netProfit: '+$14B', changeFromPrevious: '+10%' },
  ],
  EBAY: [
    { quarter: 'Q1 2023', revenue: '+$5B', expenses: '-$4B', profitBeforeTax: '+$1B', netProfit: '+$0.8B', changeFromPrevious: '+3%' },
    { quarter: 'Q2 2023', revenue: '+$5.5B', expenses: '-$4.5B', profitBeforeTax: '+$1.2B', netProfit: '+$1B', changeFromPrevious: '+7%' },
    { quarter: 'Q3 2023', revenue: '+$6B', expenses: '-$5B', profitBeforeTax: '+$1.5B', netProfit: '+$1.2B', changeFromPrevious: '+6%' },
    { quarter: 'Q4 2023', revenue: '+$6.5B', expenses: '-$5.5B', profitBeforeTax: '+$1.8B', netProfit: '+$1.5B', changeFromPrevious: '+10%' },
    { quarter: 'Q1 2024', revenue: '+$7B', expenses: '-$6B', profitBeforeTax: '+$2B', netProfit: '+$1.7B', changeFromPrevious: '+4%' },
    { quarter: 'Q2 2024', revenue: '+$7.5B', expenses: '-$6.5B', profitBeforeTax: '+$2.2B', netProfit: '+$1.9B', changeFromPrevious: '+8%' },
    { quarter: 'Q3 2024', revenue: '+$8B', expenses: '-$7B', profitBeforeTax: '+$2.5B', netProfit: '+$2.2B', changeFromPrevious: '+7%' },
    { quarter: 'Q4 2024', revenue: '+$8.5B', expenses: '-$7.5B', profitBeforeTax: '+$2.8B', netProfit: '+$2.5B', changeFromPrevious: '+10%' },
  ],
  ETSY: [
    { quarter: 'Q1 2023', revenue: '+$1B', expenses: '-$0.8B', profitBeforeTax: '+$0.2B', netProfit: '+$0.15B', changeFromPrevious: '+4%' },
    { quarter: 'Q2 2023', revenue: '+$1.2B', expenses: '-$1B', profitBeforeTax: '+$0.3B', netProfit: '+$0.2B', changeFromPrevious: '+6%' },
    { quarter: 'Q3 2023', revenue: '+$1.3B', expenses: '-$1.1B', profitBeforeTax: '+$0.4B', netProfit: '+$0.25B', changeFromPrevious: '+7%' },
    { quarter: 'Q4 2023', revenue: '+$1.5B', expenses: '-$1.2B', profitBeforeTax: '+$0.6B', netProfit: '+$0.4B', changeFromPrevious: '+10%' },
    { quarter: 'Q1 2024', revenue: '+$1.6B', expenses: '-$1.3B', profitBeforeTax: '+$0.7B', netProfit: '+$0.5B', changeFromPrevious: '+3%' },
    { quarter: 'Q2 2024', revenue: '+$1.8B', expenses: '-$1.5B', profitBeforeTax: '+$0.8B', netProfit: '+$0.6B', changeFromPrevious: '+12%' },
    { quarter: 'Q3 2024', revenue: '+$2B', expenses: '-$1.7B', profitBeforeTax: '+$1B', netProfit: '+$0.8B', changeFromPrevious: '+8%' },
    { quarter: 'Q4 2024', revenue: '+$2.2B', expenses: '-$1.9B', profitBeforeTax: '+$1.2B', netProfit: '+$1B', changeFromPrevious: '+10%' },
  ],
  SBI: [
    { quarter: 'Q1 2023', revenue: '+₹50B', expenses: '-₹40B', profitBeforeTax: '+₹10B', netProfit: '+₹8B', changeFromPrevious: '+5%' },
    { quarter: 'Q2 2023', revenue: '+₹55B', expenses: '-₹45B', profitBeforeTax: '+₹11B', netProfit: '+₹9B', changeFromPrevious: '+7%' },
    { quarter: 'Q3 2023', revenue: '+₹60B', expenses: '-₹50B', profitBeforeTax: '+₹12B', netProfit: '+₹10B', changeFromPrevious: '+6%' },
    { quarter: 'Q4 2023', revenue: '+₹65B', expenses: '-₹55B', profitBeforeTax: '+₹13B', netProfit: '+₹11B', changeFromPrevious: '+10%' },
    { quarter: 'Q1 2024', revenue: '+₹62B', expenses: '-₹52B', profitBeforeTax: '+₹12B', netProfit: '+₹10B', changeFromPrevious: '+3%' },
    { quarter: 'Q2 2024', revenue: '+₹68B', expenses: '-₹58B', profitBeforeTax: '+₹14B', netProfit: '+₹12B', changeFromPrevious: '+12%' },
    { quarter: 'Q3 2024', revenue: '+₹72B', expenses: '-₹62B', profitBeforeTax: '+₹15B', netProfit: '+₹13B', changeFromPrevious: '+7%' },
    { quarter: 'Q4 2024', revenue: '+₹75B', expenses: '-₹65B', profitBeforeTax: '+₹16B', netProfit: '+₹14B', changeFromPrevious: '+10%' },
  ],
  FEDEX: [
    { quarter: 'Q1 2023', revenue: '+$18B', expenses: '-$15B', profitBeforeTax: '+$3B', netProfit: '+$2B', changeFromPrevious: '+3%' },
    { quarter: 'Q2 2023', revenue: '+$20B', expenses: '-$17B', profitBeforeTax: '+$4B', netProfit: '+$3B', changeFromPrevious: '+7%' },
    { quarter: 'Q3 2023', revenue: '+$22B', expenses: '-$19B', profitBeforeTax: '+$5B', netProfit: '+$4B', changeFromPrevious: '+6%' },
    { quarter: 'Q4 2023', revenue: '+$24B', expenses: '-$21B', profitBeforeTax: '+$6B', netProfit: '+$5B', changeFromPrevious: '+10%' },
    { quarter: 'Q1 2024', revenue: '+$25B', expenses: '-$22B', profitBeforeTax: '+$7B', netProfit: '+$6B', changeFromPrevious: '+3%' },
    { quarter: 'Q2 2024', revenue: '+$28B', expenses: '-$24B', profitBeforeTax: '+$8B', netProfit: '+$7B', changeFromPrevious: '+12%' },
    { quarter: 'Q3 2024', revenue: '+$30B', expenses: '-$26B', profitBeforeTax: '+$9B', netProfit: '+$8B', changeFromPrevious: '+7%' },
    { quarter: 'Q4 2024', revenue: '+$32B', expenses: '-$28B', profitBeforeTax: '+$10B', netProfit: '+$9B', changeFromPrevious: '+10%' },
  ],
  BLUEDART: [
    { quarter: 'Q1 2023', revenue: '+₹8B', expenses: '-₹6B', profitBeforeTax: '+₹2B', netProfit: '+₹1.5B', changeFromPrevious: '+4%' },
    { quarter: 'Q2 2023', revenue: '+₹9B', expenses: '-₹7B', profitBeforeTax: '+₹2.5B', netProfit: '+₹2B', changeFromPrevious: '+6%' },
    { quarter: 'Q3 2023', revenue: '+₹10B', expenses: '-₹8B', profitBeforeTax: '+₹3B', netProfit: '+₹2.5B', changeFromPrevious: '+7%' },
    { quarter: 'Q4 2023', revenue: '+₹11B', expenses: '-₹9B', profitBeforeTax: '+₹3.5B', netProfit: '+₹3B', changeFromPrevious: '+10%' },
    { quarter: 'Q1 2024', revenue: '+₹12B', expenses: '-₹10B', profitBeforeTax: '+₹4B', netProfit: '+₹3.5B', changeFromPrevious: '+3%' },
    { quarter: 'Q2 2024', revenue: '+₹13B', expenses: '-₹11B', profitBeforeTax: '+₹4.5B', netProfit: '+₹4B', changeFromPrevious: '+12%' },
    { quarter: 'Q3 2024', revenue: '+₹14B', expenses: '-₹12B', profitBeforeTax: '+₹5B', netProfit: '+₹4.5B', changeFromPrevious: '+8%' },
    { quarter: 'Q4 2024', revenue: '+₹15B', expenses: '-₹13B', profitBeforeTax: '+₹5.5B', netProfit: '+₹5B', changeFromPrevious: '+10%' },
  ],
  HUGOBOSS: [
    { quarter: 'Q1 2023', revenue: '+€2B', expenses: '-€1.5B', profitBeforeTax: '+€0.5B', netProfit: '+€0.4B', changeFromPrevious: '+2%' },
    { quarter: 'Q2 2023', revenue: '+€2.2B', expenses: '-€1.7B', profitBeforeTax: '+€0.6B', netProfit: '+€0.5B', changeFromPrevious: '+5%' },
    { quarter: 'Q3 2023', revenue: '+€2.4B', expenses: '-€1.8B', profitBeforeTax: '+€0.7B', netProfit: '+€0.6B', changeFromPrevious: '+5%' },
    { quarter: 'Q4 2023', revenue: '+€2.6B', expenses: '-€2B', profitBeforeTax: '+€0.8B', netProfit: '+€0.7B', changeFromPrevious: '+10%' },
    { quarter: 'Q1 2024', revenue: '+€2.8B', expenses: '-€2.2B', profitBeforeTax: '+€0.9B', netProfit: '+€0.8B', changeFromPrevious: '+2%' },
    { quarter: 'Q2 2024', revenue: '+€3B', expenses: '-€2.3B', profitBeforeTax: '+€1B', netProfit: '+€0.9B', changeFromPrevious: '+10%' },
    { quarter: 'Q3 2024', revenue: '+€3.2B', expenses: '-€2.5B', profitBeforeTax: '+€1.2B', netProfit: '+€1.1B', changeFromPrevious: '+5%' },
    { quarter: 'Q4 2024', revenue: '+€3.5B', expenses: '-€2.8B', profitBeforeTax: '+€1.4B', netProfit: '+€1.2B', changeFromPrevious: '+10%' },
  ],
  LOUISVUITTON: [
    { quarter: 'Q1 2023', revenue: '+€5B', expenses: '-€4B', profitBeforeTax: '+€1B', netProfit: '+€0.8B', changeFromPrevious: '+3%' },
    { quarter: 'Q2 2023', revenue: '+€5.5B', expenses: '-€4.5B', profitBeforeTax: '+€1.2B', netProfit: '+€1B', changeFromPrevious: '+7%' },
    { quarter: 'Q3 2023', revenue: '+€6B', expenses: '-€5B', profitBeforeTax: '+€1.5B', netProfit: '+€1.2B', changeFromPrevious: '+6%' },
    { quarter: 'Q4 2023', revenue: '+€6.5B', expenses: '-€5.5B', profitBeforeTax: '+€1.8B', netProfit: '+€1.5B', changeFromPrevious: '+10%' },
    { quarter: 'Q1 2024', revenue: '+€7B', expenses: '-€6B', profitBeforeTax: '+€2B', netProfit: '+€1.7B', changeFromPrevious: '+4%' },
    { quarter: 'Q2 2024', revenue: '+€7.5B', expenses: '-€6.5B', profitBeforeTax: '+€2.2B', netProfit: '+€1.9B', changeFromPrevious: '+8%' },
    { quarter: 'Q3 2024', revenue: '+€8B', expenses: '-€7B', profitBeforeTax: '+€2.5B', netProfit: '+€2.2B', changeFromPrevious: '+7%' },
    { quarter: 'Q4 2024', revenue: '+€8.5B', expenses: '-€7.5B', profitBeforeTax: '+€2.8B', netProfit: '+€2.5B', changeFromPrevious: '+10%' },
  ],
  AIRBUS: [
    { quarter: 'Q1 2023', revenue: '+€20B', expenses: '-€15B', profitBeforeTax: '+€5B', netProfit: '+€4B', changeFromPrevious: '+3%' },
    { quarter: 'Q2 2023', revenue: '+€22B', expenses: '-€17B', profitBeforeTax: '+€6B', netProfit: '+€5B', changeFromPrevious: '+7%' },
    { quarter: 'Q3 2023', revenue: '+€24B', expenses: '-€19B', profitBeforeTax: '+€7B', netProfit: '+€6B', changeFromPrevious: '+6%' },
    { quarter: 'Q4 2023', revenue: '+€26B', expenses: '-€21B', profitBeforeTax: '+€8B', netProfit: '+€7B', changeFromPrevious: '+10%' },
    { quarter: 'Q1 2024', revenue: '+€28B', expenses: '-€22B', profitBeforeTax: '+€9B', netProfit: '+€8B', changeFromPrevious: '+3%' },
    { quarter: 'Q2 2024', revenue: '+€30B', expenses: '-€24B', profitBeforeTax: '+€10B', netProfit: '+€9B', changeFromPrevious: '+12%' },
    { quarter: 'Q3 2024', revenue: '+€32B', expenses: '-€26B', profitBeforeTax: '+€11B', netProfit: '+€10B', changeFromPrevious: '+7%' },
    { quarter: 'Q4 2024', revenue: '+€34B', expenses: '-€28B', profitBeforeTax: '+€12B', netProfit: '+€11B', changeFromPrevious: '+10%' },
  ],
  LOCKHEEDMARTIN: [
    { quarter: 'Q1 2023', revenue: '+$15B', expenses: '-$12B', profitBeforeTax: '+$3B', netProfit: '+$2B', changeFromPrevious: '+3%' },
    { quarter: 'Q2 2023', revenue: '+$16B', expenses: '-$13B', profitBeforeTax: '+$3.5B', netProfit: '+$2.5B', changeFromPrevious: '+7%' },
    { quarter: 'Q3 2023', revenue: '+$17B', expenses: '-$14B', profitBeforeTax: '+$4B', netProfit: '+$3B', changeFromPrevious: '+6%' },
    { quarter: 'Q4 2023', revenue: '+$18B', expenses: '-$15B', profitBeforeTax: '+$5B', netProfit: '+$4B', changeFromPrevious: '+10%' },
    { quarter: 'Q1 2024', revenue: '+$19B', expenses: '-$16B', profitBeforeTax: '+$6B', netProfit: '+$5B', changeFromPrevious: '+3%' },
    { quarter: 'Q2 2024', revenue: '+$20B', expenses: '-$17B', profitBeforeTax: '+$7B', netProfit: '+$6B', changeFromPrevious: '+12%' },
    { quarter: 'Q3 2024', revenue: '+$21B', expenses: '-$18B', profitBeforeTax: '+$8B', netProfit: '+$7B', changeFromPrevious: '+7%' },
    { quarter: 'Q4 2024', revenue: '+$22B', expenses: '-$19B', profitBeforeTax: '+$9B', netProfit: '+$8B', changeFromPrevious: '+10%' },
  ],
  SPICEJET: [
    { quarter: 'Q1 2023', revenue: '+₹5B', expenses: '-₹4B', profitBeforeTax: '+₹1B', netProfit: '+₹0.8B', changeFromPrevious: '+4%' },
    { quarter: 'Q2 2023', revenue: '+₹5.5B', expenses: '-₹4.5B', profitBeforeTax: '+₹1.2B', netProfit: '+₹1B', changeFromPrevious: '+7%' },
    { quarter: 'Q3 2023', revenue: '+₹6B', expenses: '-₹5B', profitBeforeTax: '+₹1.5B', netProfit: '+₹1.2B', changeFromPrevious: '+6%' },
    { quarter: 'Q4 2023', revenue: '+₹6.5B', expenses: '-₹5.5B', profitBeforeTax: '+₹1.8B', netProfit: '+₹1.5B', changeFromPrevious: '+10%' },
    { quarter: 'Q1 2024', revenue: '+₹7B', expenses: '-₹6B', profitBeforeTax: '+₹2B', netProfit: '+₹1.7B', changeFromPrevious: '+4%' },
    { quarter: 'Q2 2024', revenue: '+₹7.5B', expenses: '-₹6.5B', profitBeforeTax: '+₹2.2B', netProfit: '+₹1.9B', changeFromPrevious: '+8%' },
    { quarter: 'Q3 2024', revenue: '+₹8B', expenses: '-₹7B', profitBeforeTax: '+₹2.5B', netProfit: '+₹2.2B', changeFromPrevious: '+7%' },
    { quarter: 'Q4 2024', revenue: '+₹8.5B', expenses: '-₹7.5B', profitBeforeTax: '+₹2.8B', netProfit: '+₹2.5B', changeFromPrevious: '+10%' },
  ],
  UNDERARMOUR: [
    { quarter: 'Q1 2023', revenue: '+$1.5B', expenses: '-$1.2B', profitBeforeTax: '+$0.3B', netProfit: '+$0.25B', changeFromPrevious: '+4%' },
    { quarter: 'Q2 2023', revenue: '+$1.7B', expenses: '-$1.4B', profitBeforeTax: '+$0.35B', netProfit: '+$0.3B', changeFromPrevious: '+6%' },
    { quarter: 'Q3 2023', revenue: '+$1.8B', expenses: '-$1.5B', profitBeforeTax: '+$0.4B', netProfit: '+$0.35B', changeFromPrevious: '+7%' },
    { quarter: 'Q4 2023', revenue: '+$2B', expenses: '-$1.7B', profitBeforeTax: '+$0.5B', netProfit: '+$0.4B', changeFromPrevious: '+10%' },
    { quarter: 'Q1 2024', revenue: '+$2.2B', expenses: '-$1.9B', profitBeforeTax: '+$0.6B', netProfit: '+$0.5B', changeFromPrevious: '+3%' },
    { quarter: 'Q2 2024', revenue: '+$2.5B', expenses: '-$2.2B', profitBeforeTax: '+$0.8B', netProfit: '+$0.7B', changeFromPrevious: '+12%' },
    { quarter: 'Q3 2024', revenue: '+$2.7B', expenses: '-$2.3B', profitBeforeTax: '+$0.9B', netProfit: '+$0.8B', changeFromPrevious: '+8%' },
    { quarter: 'Q4 2024', revenue: '+$3B', expenses: '-$2.5B', profitBeforeTax: '+$1B', netProfit: '+$0.9B', changeFromPrevious: '+10%' },
  ],
  LULULEMON: [
    { quarter: 'Q1 2023', revenue: '+$2B', expenses: '-$1.5B', profitBeforeTax: '+$0.5B', netProfit: '+$0.4B', changeFromPrevious: '+4%' },
    { quarter: 'Q2 2023', revenue: '+$2.2B', expenses: '-$1.7B', profitBeforeTax: '+$0.6B', netProfit: '+$0.5B', changeFromPrevious: '+6%' },
    { quarter: 'Q3 2023', revenue: '+$2.4B', expenses: '-$1.8B', profitBeforeTax: '+$0.7B', netProfit: '+$0.6B', changeFromPrevious: '+7%' },
    { quarter: 'Q4 2023', revenue: '+$2.6B', expenses: '-$2B', profitBeforeTax: '+$0.8B', netProfit: '+$0.7B', changeFromPrevious: '+10%' },
    { quarter: 'Q1 2024', revenue: '+$2.8B', expenses: '-$2.2B', profitBeforeTax: '+$0.9B', netProfit: '+$0.8B', changeFromPrevious: '+3%' },
    { quarter: 'Q2 2024', revenue: '+$3B', expenses: '-$2.3B', profitBeforeTax: '+$1B', netProfit: '+$0.9B', changeFromPrevious: '+12%' },
    { quarter: 'Q3 2024', revenue: '+$3.2B', expenses: '-$2.5B', profitBeforeTax: '+$1.2B', netProfit: '+$1.1B', changeFromPrevious: '+8%' },
    { quarter: 'Q4 2024', revenue: '+$3.5B', expenses: '-$2.8B', profitBeforeTax: '+$1.4B', netProfit: '+$1.2B', changeFromPrevious: '+10%' },
  ],
  };
  

function StockView() {
	const { symbol } = useParams();
	const location = useLocation();

	const [onWatchlist, setOnWatchlist] = useState(false);

	const [stock, setStock] = useReducer(
		(state: any, newState: any) => ({ ...state, ...newState }),
		{
			symbol,
			longName: "",
			regularMarketPrice: -1,
			regularMarketChangePercent: 0,
		},
	);

	useEffect(() => {
		// Check if stock is on watchlist
		if (tokens.isAuthenticated()) {
			accounts.getWatchlist(true).then((res: any[]) => {
				setOnWatchlist(res.some((stock) => stock.symbol === symbol));
			});
		}

		axios
			.get(`/api/stocks/${symbol}/info`)
			.then((res) => {
				setStock({ ...res.data });
			})
			.catch((err) => {
				console.log(err);
			});
	}, [location]);

	if (stock.regularMarketPrice < 0) {
		return (
			<Flex justifyContent="center">
				<Spinner size="xl" />
			</Flex>
		);
	}

	return (
		<>
			{stock.regularMarketPrice > 0 && (
				<Flex direction={{ base: "column", md: "row" }} gap={5}>
					<Box flex={tokens.isAuthenticated() ? "0.75" : "1"}>
						<Flex justifyContent={"space-between"}>
							<Stat>
								<Heading size="md" fontWeight="md">
									{stock.longName}
								</Heading>
								<Spacer h="1" />
								<Heading size="xl">
									{formatter.format(stock.regularMarketPrice)}
								</Heading>
								<HStack>
									<Heading
										size="md"
										color={
											stock.regularMarketChangePercent > 0
												? "green.500"
												: "red.500"
										}
									>
										{stock.regularMarketChangePercent > 0 ? (
											<ArrowUpIcon />
										) : (
											<ArrowDownIcon />
										)}
										{stock.regularMarketChangePercent.toFixed(2)}%
									</Heading>
									<Heading size="sm" color="gray.500">
										Today
									</Heading>
								</HStack>
							</Stat>
							{tokens.isAuthenticated() &&
								(onWatchlist ? (
									<Button
										leftIcon={<MinusIcon />}
										variant={"outline"}
										onClick={() =>
											accounts
												.editWatchlist(symbol as string, "remove")
												.then(() => setOnWatchlist(false))
										}
									>
										Remove from Watchlist
									</Button>
								) : (
									<Button
										leftIcon={<AddIcon />}
										variant={"outline"}
										onClick={() =>
											accounts
												.editWatchlist(symbol as string, "add")
												.then(() => setOnWatchlist(true))
										}
									>
										Add to Watchlist
									</Button>
								))}
						</Flex>

						<Spacer height={5} />

						{/* <StockChart symbol={symbol as string} /> */}
						<Box p={5} borderWidth="1px" borderRadius="md">

				<p>
				{businessDescriptions[symbol] || "No description available for this stock."}
				</p>
			</Box>          <Spacer height={6} />
			<Heading size="md">Pros and Cons</Heading>

          <Box p={5} borderWidth="0px" borderRadius="md" backgroundColor="">
            <Grid templateColumns="repeat(2, 1fr)" gap={4}>
              {/* Pros */}
              <Box p={5} borderRadius="md" backgroundColor="" border="1px" borderColor={"green.100"}>
                <Heading size="sm" color="green.200" mb={2}>
                  Pros
                </Heading>
                <List spacing={2}>
                  {prosAndCons[symbol]?.pros.map((pro, index) => (
                    <ListItem key={index} display="flex" alignItems="center" color="green.200">
                      <ListIcon as={CheckCircleIcon} color="green.200" mr={2} />
                      {pro}
                    </ListItem>
                  )) || <ListItem>No pros available.</ListItem>}
                </List>
              </Box>

              {/* Cons */}
              <Box p={5} borderRadius="md" backgroundColor="2d3748" border={"1px"} borderColor={"red.100"} marginRight={5}>
                <Heading size="sm" color="red.100" mb={2}>
                  Cons
                </Heading>
                <List spacing={2}>
                  {prosAndCons[symbol]?.cons.map((con, index) => (
                    <ListItem key={index} display="flex" alignItems="center" color="red.100">
                      <ListIcon as={WarningIcon} color="red.100" mr={2} />
                      {con}
                    </ListItem>
                  )) || <ListItem>No cons available.</ListItem>}
                </List>
              </Box>
            </Grid>
          	</Box>
					</Box>
					{tokens.isAuthenticated() && (
						<Box flex="0.25" borderWidth="1px" borderRadius="md" p={5}>
							<TransactionPane
								symbol={symbol as string}
								price={stock.regularMarketPrice}
							/>
						</Box>
					)}
				</Flex>
			)}
			<Spacer height={5} />

			<Spacer height={5} />

			<Spacer height={5} />

			<Spacer height={5} />
				<Flex>
					<Box           marginRight={"2%"}
					>
			<Heading size="md" color="white">Key Executives</Heading>
          <Spacer height={5} />
          {/* below section is for the key executives table */}
          <Box
            p={5}
            borderRadius="md"
            backgroundColor=""
            borderWidth="1px"
          // border="2px solid"
          // borderColor="green.100"
          >
            <Table variant="simple" colorScheme="whiteAlpha">
              <Thead>
                <Tr>
                  <Th color="white">Name</Th>
                  <Th color="white">Position</Th>
                </Tr>
              </Thead>
              <Tbody>
                {executives[symbol]?.map((executive, index) => (
                  <Tr key={index}>
                    <Td color="white">{executive.name}</Td>
                    <Td color="white">{executive.position}</Td>
                  </Tr>
                )) || (
                    <Tr>
                      <Td colSpan={2} textAlign="center" color="gray.300">
                        No executives available.
                      </Td>
                    </Tr>
                  )}
              </Tbody>
            </Table>
          </Box>
		  </Box>
        <Box marginRight={"2%"}>
          <Heading size="md" color="white">Product Portfolio</Heading>
          <Spacer height={5} />
          <Box
            p={5}
            borderRadius="md"
            backgroundColor=""  // Adjusted to match the theme
            borderWidth="1px"
            borderColor=""
          >
            <Table variant="simple" colorScheme="whiteAlpha">
              <Thead>
                <Tr>
                  <Th color="white">Product</Th>
                  <Th color="white">Revenue Share</Th>
                  <Th color="white">Insight</Th>  {/* Added new column */}
                </Tr>
              </Thead>
              <Tbody>
                {topProducts[symbol]?.map((product, index) => (
                  <Tr key={index}>
                    <Td color="white">{product.name}</Td>
                    <Td color="white">{product.share}</Td>
                    <Td color="white">{product.insight}</Td>  {/* Displaying the new data */}
                  </Tr>
                )) || (
                    <Tr>
                      <Td colSpan={3} textAlign="center" color="gray.300">
                        No products available.
                      </Td>
                    </Tr>
                  )}
              </Tbody>
            </Table>
          </Box>
        </Box>
        <Box>
          <Heading size="md" color="white">Key Markets</Heading>
          <Spacer height={5} />
          <Box
            p={5}
            borderRadius="md"
            backgroundColor=""  // Adjusted to match the theme
            borderWidth="1px"
            borderColor=""
          >
            <Table variant="simple" colorScheme="whiteAlpha">
              <Thead>
                <Tr>
                  <Th color="white">Country</Th>
                  <Th color="white">Revenue Share</Th>
                </Tr>
              </Thead>
              <Tbody>
                {topCountries[symbol]?.map((topCountries, index) => (
                  <Tr key={index}>
                    <Td color="white">{topCountries.country}</Td>
                    <Td color="white">{topCountries.revenueShare}</Td>
                  </Tr>
                )) || (
                    <Tr>
                      <Td colSpan={3} textAlign="center" color="gray.300">
                        No products available.
                      </Td>
                    </Tr>
                  )}
              </Tbody>
            </Table>
          </Box>
        </Box>
		</Flex>
      <Spacer height={50} />
      <Heading size="md" color="white">Top Competitors</Heading>
      <Spacer height={5} />
      <Box p={5} borderRadius="md" backgroundColor="" borderWidth="1px" borderColor="">

        <Table variant="simple" colorScheme="whiteAlpha" size="lg">
          <Thead>
            <Tr>
              <Th color="white">Competitor Name</Th>
              <Th color="white">Market Share</Th>
              <Th color="white">Customer Rating</Th>
              <Th color="white">Price Point</Th>
              <Th color="white">Financial Health</Th>
            </Tr>
          </Thead>
          <Tbody>
            {topCompetitors[symbol]?.map((competitor, index) => (
              <Tr key={index} bg={competitor.symbol === symbol ? "blue.700" : ""}>
                <Td color="white">{competitor.name}</Td>
                <Td color="white">{competitor.marketShare}</Td>
                <Td color="white">{competitor.customerRating}</Td>
                <Td color="white">{competitor.pricePoint}</Td>
                <Td color="white">{competitor.financialHealth}</Td>
              </Tr>
            )) || (
                <Tr>
                  <Td colSpan={5} textAlign="center" color="gray.300">
                    No competitors available.
                  </Td>
                </Tr>
              )}
          </Tbody>
        </Table>
      </Box>
      <Spacer height={50} />
      <Heading size="md" color="white">Quarterly Results</Heading>
      <Spacer height={5} />

      <Box p={5} borderRadius="md" backgroundColor="" borderWidth="1px" borderColor="">
        <Table variant="simple" colorScheme="whiteAlpha" size="lg">
          <Thead>
            <Tr>
              <Th color="white">Quarter</Th>
              <Th color="white">Revenue</Th>
              <Th color="white">Expenses</Th>
              <Th color="white">Profit Before Tax</Th>
              <Th color="white">Net Profit</Th>
              <Th color="white">Revenue Change From Previous</Th>
            </Tr>
          </Thead>
          <Tbody>
            {quarterlyResults[symbol]?.map((quarter, index) => (
              <Tr key={index} bg={index % 2 === 0 ? "gray.700" : ""}>
                <Td color="white">{quarter.quarter}</Td>
                <Td color="white">{quarter.revenue}</Td>
                <Td color="white">{quarter.expenses}</Td>
                <Td color="white">{quarter.profitBeforeTax}</Td>
                <Td color="white">{quarter.netProfit}</Td>
                <Td color="white" textAlign="center">
                  {quarter.changeFromPrevious ? (
                    <>
                      {quarter.changeFromPrevious.includes('+') ? (
                        <Box color="green.300" display="flex" alignItems="center">
                          <TriangleUpIcon mr={1} />
                          <strong>{quarter.changeFromPrevious}</strong>
                        </Box>
                      ) : (
                        <Box color="red.500" display="flex" alignItems="center">
                          <TriangleDownIcon mr={1} />
                          {quarter.changeFromPrevious}
                        </Box>
                      )}
                    </>
                  ) : null}
                </Td>
              </Tr>
            )) || (
                <Tr>
                  <Td colSpan={6} textAlign="center" color="gray.300">
                    No quarterly results available.
                  </Td>
                </Tr>
              )}
          </Tbody>
        </Table>
      </Box>
			  
      <Spacer height={50} />
	  <Heading size="md">{symbol as string} News</Heading>
      <Spacer height={5} />

			<Newsfeed symbol={symbol as string} />
		</>
	);
}

export default StockView;
