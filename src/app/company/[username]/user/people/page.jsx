"use client";
import React, { useState, useEffect } from "react";
import CompanyPeopleContainer from "@/app/components/modules/company-page-user/container/CompanyPeopleContainer";
import { useParams } from "next/navigation";

export default function people(){
    const { username } = useParams();
    return(
        <div>
            <CompanyPeopleContainer username={username}/>
        </div>
    );

}