import React, { useEffect, useState } from "react";
import accounts from "../services/accounts.service";
import {
	Tag,
	Text,
	Card,
	CardHeader,
	CardBody,
	Heading,
	Stack,
	StackDivider,
	Flex,
	Spinner,
    Progress,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";

const steps = [
    { title: 'First', description: 'Contact Info' },
    { title: 'Second', description: 'Date & Time' },
    { title: 'Third', description: 'Select Rooms' },
  ]
  

function Achievements() {

    return (

        <Card>
<Progress value={80} />

        </Card>
    )
}

export default Achievements