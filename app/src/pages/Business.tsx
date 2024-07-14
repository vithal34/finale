import React, { useEffect } from "react";
import {
  Box,
  Spacer,
  Heading,
  useBreakpointValue,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  Text,
  CardFooter,
  Button,
  useColorMode,
  Avatar,
  WrapItem,
  Badge,
} from "@chakra-ui/react";
import PortfolioPreview from "../components/PortfolioPreview";
import tokens from "../services/tokens.service";
import { useNavigate } from "react-router-dom";

// Business descriptions

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
  LULULEMON: "Lululemon Athletica Inc. is a Canadian-American multinational athletic apparel retailer known for its high-quality yoga wear, activewear, and related accessories.",
  SPRITE: "Sprite Inc. is a Canadian-American multinational athletic apparel retailer known for its high-quality yoga wear, activewear, and related accessories."

};

// Business categories
const businessCategories = {
  Technology: ["MSFT", "GOOG", "INFY", "ADBE", "INTC", "HP", "DELL", "TSLA"],
  Automotive: ["TSLA", "MITSUBISHI", "MERCEDES", "VOLKSWAGEN"],
  Electronics: ["SAMSUNG", "SONY", "AAPL", "BOSE"],
  Beverages: ["COCACOLA", "PEPSICO", "STARBUCKS", "SPRITE"],
  Food: ["MCD", "KFC", "TACOBELL", "DOMINOS"],
  ECommerce: ["ALIBABA", "ETSY", "EBAY", "AMAZON"],
  Banking: ["TCS", "HDFC", "ICICI", "SBI"],
  RideHailing: ["UBER", "OLA", "BLUEDART", "FEDEX"],
  Fashion: ["DIOR", "GUCCI", "LOUISVUITTON", "HUGOBOSS"],
  Aerospace: ["BOEING", "SPICEJET", "AIRBUS", "LOCKHEEDMARTIN"],
  Sports: ["NIKE", "LULULEMON", "UNDERARMOUR", "ADIDAS"],
};

export default function Business() {
  const isOnMobile = useBreakpointValue({ base: true, md: false });
  const navigate = useNavigate();
  const { colorMode } = useColorMode();

  useEffect(() => {
    if (!tokens.isAuthenticated()) {
      navigate("/login");
    }
  }, [navigate]);

  // Function to handle navigation to the stock page
  const handleLearnMoreClick = (symbol) => {
    navigate(`/stocks/${symbol}`);
  };

  // Render business cards for a specific category
  const renderBusinessCards = (category) => {
    return businessCategories[category].map((symbol) => (
      <Card
        key={symbol}
        align="center"
        textAlign="center"
        width="300px"
        boxShadow={colorMode === "light" ? "base" : "dark-lg"}
        transition="transform 0.2s, box-shadow 0.2s"
        _hover={{
          transform: "scale(1.05)",
          boxShadow: colorMode === "light" ? "xl" : "dark-xl",
        }}
        bg={colorMode === "light" ? "white" : "gray.800"}
        color={colorMode === "light" ? "black" : "white"}
      >
        <CardHeader textAlign="center">
          <Heading size="md">{symbol}</Heading>
          {/* <Badge>Default</Badge> */}
        </CardHeader>
        <WrapItem>
    <Avatar size='xl' name='Segun Adebayo' src={`../public/logo/${symbol}.jpeg`} />{' '}
  </WrapItem>
        <CardBody>
          <Text>{businessDescriptions[symbol]}</Text>
        </CardBody>
        <CardFooter>
          <Button
            colorScheme="teal"
            onClick={() => handleLearnMoreClick(symbol)}
          >
            Invest in {symbol}
          </Button>
        </CardFooter>
      </Card>
    ));
  };

  return (
    <Box className="Dashboard">
      <Box flex="0.75">
        <PortfolioPreview username={localStorage.getItem("username")} />
        {!isOnMobile && (
          <>
            <Spacer height={10} />
            <Heading size="lg">Invest in Businesses:</Heading>
            <Spacer height={2} />
          </>
        )}
      </Box>

      {/* Render each category with its respective business cards */}
      {Object.keys(businessCategories).map((category) => (
        <Box key={category} mt={8}>
          <Heading size="lg" mb={4}>
            {category}
          </Heading>

          <SimpleGrid
            spacing={4}
            templateColumns="repeat(auto-fill, minmax(300px, 1fr))"
          >
            {renderBusinessCards(category)}
          </SimpleGrid>
        </Box>
      ))}

      {isOnMobile && (
        <>
          <Spacer height={10} />
          <Heading size="md">Stock Market News</Heading>
          <Spacer height={2} />
        </>
      )}
    </Box>
  );
}
