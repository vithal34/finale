import React from "react";
import {
  Box,
  Flex,
  Spacer,
  Heading,
  Text,
  useBreakpointValue,
  Link,
} from "@chakra-ui/react";
import { Navigate, Link as RouterLink } from "react-router-dom";
import PortfolioPreview from "../components/PortfolioPreview";
import PositionsList from "../components/PositionsList";
import Newsfeed from "../components/Newsfeed";
import Watchlist from "../components/Watchlist";
import tokens from "../services/tokens.service";
import Achievements from "../components/Achievements"
import UserActivities from "../components/UserActivities"; // Import UserActivities component

export default function Dashboard() {
  const isOnMobile = useBreakpointValue({ base: true, md: false });
  const isAuthenticated = tokens.isAuthenticated();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <Box className="Dashboard">
      <Flex direction={{ base: "column", md: "row" }} gap={5}>
        <Box flex="0.75">
          {isAuthenticated ? (
            <PortfolioPreview />
            
          ) : (
            <>
              <Heading as="h1" size="xl">
                Empower Invest
              </Heading>
              <Text fontSize="lg">
                <Link as={RouterLink} to="/signup">
                  Create an account
                </Link>{" "}
                or{" "}
                <Link as={RouterLink} to="/login">
                  login
                </Link>{" "}
                to get started!
              </Text>
            </>
          )}
          {!isOnMobile && isAuthenticated && (
            <>
              <Spacer height={10} />
              <PositionsList />
              <Spacer height={10} />

              <Heading size="md">Stock Market News</Heading>
              <Spacer height={5} />

              <Newsfeed symbol={""} />
            </>
          )}
        </Box>
        <Box
          flex="0.25"
          borderWidth={{ base: 0, md: 1 }}
          borderRadius="md"
          p={{ base: 0, md: 3 }}
          height={"fit-content"}
        >
          {isAuthenticated ? (
            <>
              {/* <PositionsList /> */}
              <Spacer h="3" />
              <Watchlist />
              <Spacer h="3" />
              {/* <Achievements /> */}
              <UserActivities competitionsAttended={0} sessionsAttended={0} moreCount={0} />

            </>
          ) : (
            <Box>
              <Heading as="h6" size="xs" textAlign={"center"}>
                Sign in to view positions and watchlist
              </Heading>
            </Box>
          )}
        </Box>
      </Flex>
      {isOnMobile && isAuthenticated && (
        <>
          <Spacer height={10} />
          <PositionsList />
          <Heading size="md">Stock Market News</Heading>
          <Spacer height={2} />
          
          <Newsfeed symbol={""} />
        </>
      )}
    </Box>
  );
}
