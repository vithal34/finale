import React from "react";
import { Box, Flex, Icon, Card, Text, VStack } from "@chakra-ui/react";
import { HiOutlineCalendar, HiOutlineStar, HiOutlineDotsHorizontal } from "react-icons/hi";

const UserActivities = ({ sessionsAttended, competitionsAttended, moreCount }) => {
  return (
    <Card>
    <Box p={4} borderWidth="1px" borderRadius="md" shadow="md">
      <VStack spacing={4} align="stretch">
        <Flex align="center">
          <Icon as={HiOutlineCalendar} boxSize={6} color="blue.500" mr={2} />
          <Text fontSize="sm">{`Sessions Attended: ${sessionsAttended}`}</Text>
        </Flex>
        <Flex align="center">
          <Icon as={HiOutlineStar} boxSize={6} color="yellow.500" mr={2} />
          <Text fontSize="sm">{`Competitions Attended: ${competitionsAttended}`}</Text>
        </Flex>
        <Flex align="center">
          <Icon as={HiOutlineDotsHorizontal} boxSize={6} color="gray.500" mr={2} />
          <Text fontSize="sm">{`More: ${moreCount}`}</Text>
        </Flex>
        {/* Add more icons and titles as needed */}
      </VStack>
    </Box>
    </Card>
  );
};

export default UserActivities;
