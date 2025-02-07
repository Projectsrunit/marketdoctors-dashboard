"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import SidebarItem from "@/components/Sidebar/SidebarItem";
import ClickOutside from "@/components/ClickOutside";
import useLocalStorage from "@/hooks/useLocalStorage";
import {
  FaTachometerAlt,
  FaCalendarAlt,
  FaUser,
  FaRegFileAlt,
  FaCog,
  FaBook,
  FaMicrophone,
  FaBookMedical,
  FaBell,
  FaUserEdit,
} from "react-icons/fa";
import { FaPeopleGroup, FaUserDoctor } from "react-icons/fa6";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const menuGroups = [
  {
    name: "MENU",
    menuItems: [
      // {
      //   icon: <FaTachometerAlt />,
      //   label: "Dashboard",
      //   route: "#",
      //   children: [{ label: "eCommerce", route: "/" }],
      // },
      {
        icon: <FaTachometerAlt />,
        label: "Dashboard",
        route: "/admin",
      },
      // {
      //   icon: <FaUser />,
      //   label: "Profile",
      //   route: "/profile",
      // },
      // {
      //   icon: <FaRegFileAlt />,
      //   label: "Forms",
      //   route: "#",
      //   children: [
      //     { label: "Form Elements", route: "/forms/form-elements" },
      //     { label: "Form Layout", route: "/forms/form-layout" },
      //   ],
      // },
      {
        icon: <FaPeopleGroup />,
        label: "CHEWs",
        route: "/admin/chew",
      },
      {
        icon: <FaUserDoctor />,
        label: "Doctors",
        route: "/admin/doctor",
      },
      {
        icon: <FaPeopleGroup />,
        label: "Patients",
        route: "/admin/patient",
      },
      {
        icon: <FaBookMedical />,
        label: "Cases",
        route: "/admin/cases",
      },
      {
        icon: <FaBook />,
        label: "Articles",
        route: "/admin/articles",
      },
      {
        icon: <FaMicrophone />,
        label: "Advertisements",
        route: "/admin/advertisements",
      },
      {
        icon: <FaUserEdit />,
        label: "Add User",
        route: "/admin/add-user",
      },
      {
        icon: <FaBell />,
        label: "Notifications",
        route: "/admin/notifications",
      },
      // {
      //   icon: <FaCog />,
      //   label: "Settings",
      //   route: "/admin/settings",
      // },
    ],
  },
  // {
  //   name: "OTHERS",
  //   menuItems: [
  //     {
  //       icon: (
  //         <svg
  //           className="fill-current"
  //           width="18"
  //           height="19"
  //           viewBox="0 0 18 19"
  //           fill="none"
  //           xmlns="http://www.w3.org/2000/svg"
  //         >
  //           <g clipPath="url(#clip0_130_9801)">
  //             <path
  //               d="M10.8563 0.55835C10.5188 0.55835 10.2095 0.8396 10.2095 1.20522V6.83022C10.2095 7.16773 10.4907 7.4771 10.8563 7.4771H16.8751C17.0438 7.4771 17.2126 7.39272 17.3251 7.28022C17.4376 7.1396 17.4938 6.97085 17.4938 6.8021C17.2688 3.28647 14.3438 0.55835 10.8563 0.55835ZM11.4751 6.15522V1.8521C13.8095 2.13335 15.6938 3.8771 16.1438 6.18335H11.4751V6.15522Z"
  //               fill=""
  //             />
  //             <path
  //               d="M15.3845 8.7427H9.1126V2.69582C9.1126 2.35832 8.83135 2.07707 8.49385 2.07707C8.40947 2.07707 8.3251 2.07707 8.24072 2.07707C3.96572 2.04895 0.506348 5.53645 0.506348 9.81145C0.506348 14.0864 3.99385 17.5739 8.26885 17.5739C12.5438 17.5739 16.0313 14.0864 16.0313 9.81145C16.0313 9.6427 16.0313 9.47395 16.0032 9.33332C16.0032 8.99582 15.722 8.7427 15.3845 8.7427ZM8.26885 16.3083C4.66885 16.3083 1.77197 13.4114 1.77197 9.81145C1.77197 6.3802 4.47197 3.53957 7.8751 3.3427V9.36145C7.8751 9.69895 8.15635 10.0083 8.52197 10.0083H14.7938C14.6813 13.4958 11.7845 16.3083 8.26885 16.3083Z"
  //               fill=""
  //             />
  //           </g>
  //           <defs>
  //             <clipPath id="clip0_130_9801">
  //               <rect
  //                 width="18"
  //                 height="18"
  //                 fill="white"
  //                 transform="translate(0 0.052124)"
  //               />
  //             </clipPath>
  //           </defs>
  //         </svg>
  //       ),
  //       label: "Chart",
  //       route: "/chart",
  //     },
  //     {
  //       icon: (
  //         <svg
  //           className="fill-current"
  //           width="18"
  //           height="19"
  //           viewBox="0 0 18 19"
  //           fill="none"
  //           xmlns="http://www.w3.org/2000/svg"
  //         >
  //           <g clipPath="url(#clip0_130_9807)">
  //             <path
  //               d="M15.7501 0.55835H2.2501C1.29385 0.55835 0.506348 1.34585 0.506348 2.3021V7.53335C0.506348 8.4896 1.29385 9.2771 2.2501 9.2771H15.7501C16.7063 9.2771 17.4938 8.4896 17.4938 7.53335V2.3021C17.4938 1.34585 16.7063 0.55835 15.7501 0.55835ZM16.2563 7.53335C16.2563 7.8146 16.0313 8.0396 15.7501 8.0396H2.2501C1.96885 8.0396 1.74385 7.8146 1.74385 7.53335V2.3021C1.74385 2.02085 1.96885 1.79585 2.2501 1.79585H15.7501C16.0313 1.79585 16.2563 2.02085 16.2563 2.3021V7.53335Z"
  //               fill=""
  //             />
  //             <path
  //               d="M6.13135 10.9646H2.2501C1.29385 10.9646 0.506348 11.7521 0.506348 12.7083V15.8021C0.506348 16.7583 1.29385 17.5458 2.2501 17.5458H6.13135C7.0876 17.5458 7.8751 16.7583 7.8751 15.8021V12.7083C7.90322 11.7521 7.11572 10.9646 6.13135 10.9646ZM6.6376 15.8021C6.6376 16.0833 6.4126 16.3083 6.13135 16.3083H2.2501C1.96885 16.3083 1.74385 16.0833 1.74385 15.8021V12.7083C1.74385 12.4271 1.96885 12.2021 2.2501 12.2021H6.13135C6.4126 12.2021 6.6376 12.4271 6.6376 12.7083V15.8021Z"
  //               fill=""
  //             />
  //             <path
  //               d="M15.75 10.9646H11.8688C10.9125 10.9646 10.125 11.7521 10.125 12.7083V15.8021C10.125 16.7583 10.9125 17.5458 11.8688 17.5458H15.75C16.7063 17.5458 17.4938 16.7583 17.4938 15.8021V12.7083C17.4938 11.7521 16.7063 10.9646 15.75 10.9646ZM16.2562 15.8021C16.2562 16.0833 16.0312 16.3083 15.75 16.3083H11.8688C11.5875 16.3083 11.3625 16.0833 11.3625 15.8021V12.7083C11.3625 12.4271 11.5875 12.2021 11.8688 12.2021H15.75C16.0312 12.2021 16.2562 12.4271 16.2562 12.7083V15.8021Z"
  //               fill=""
  //             />
  //           </g>
  //           <defs>
  //             <clipPath id="clip0_130_9807">
  //               <rect
  //                 width="18"
  //                 height="18"
  //                 fill="white"
  //                 transform="translate(0 0.052124)"
  //               />
  //             </clipPath>
  //           </defs>
  //         </svg>
  //       ),
  //       label: "UI Elements",
  //       route: "#",
  //       children: [
  //         { label: "Alerts", route: "/ui/alerts" },
  //         { label: "Buttons", route: "/ui/buttons" },
  //       ],
  //     },
  //     {
  //       icon: (
  //         <svg
  //           className="fill-current"
  //           width="18"
  //           height="19"
  //           viewBox="0 0 18 19"
  //           fill="none"
  //           xmlns="http://www.w3.org/2000/svg"
  //         >
  //           <g clipPath="url(#clip0_130_9814)">
  //             <path
  //               d="M12.7127 0.55835H9.53457C8.80332 0.55835 8.18457 1.1771 8.18457 1.90835V3.84897C8.18457 4.18647 8.46582 4.46772 8.80332 4.46772C9.14082 4.46772 9.45019 4.18647 9.45019 3.84897V1.88022C9.45019 1.82397 9.47832 1.79585 9.53457 1.79585H12.7127C13.3877 1.79585 13.9221 2.33022 13.9221 3.00522V15.0709C13.9221 15.7459 13.3877 16.2802 12.7127 16.2802H9.53457C9.47832 16.2802 9.45019 16.2521 9.45019 16.1959V14.2552C9.45019 13.9177 9.16894 13.6365 8.80332 13.6365C8.43769 13.6365 8.18457 13.9177 8.18457 14.2552V16.1959C8.18457 16.9271 8.80332 17.5459 9.53457 17.5459H12.7127C14.0908 17.5459 15.1877 16.4209 15.1877 15.0709V3.03335C15.1877 1.65522 14.0627 0.55835 12.7127 0.55835Z"
  //               fill=""
  //             />
  //             <path
  //               d="M10.4346 8.60205L7.62207 5.7333C7.36895 5.48018 6.97519 5.48018 6.72207 5.7333C6.46895 5.98643 6.46895 6.38018 6.72207 6.6333L8.46582 8.40518H3.45957C3.12207 8.40518 2.84082 8.68643 2.84082 9.02393C2.84082 9.36143 3.12207 9.64268 3.45957 9.64268H8.49395L6.72207 11.4427C6.46895 11.6958 6.46895 12.0896 6.72207 12.3427C6.83457 12.4552 7.00332 12.5114 7.17207 12.5114C7.34082 12.5114 7.50957 12.4552 7.62207 12.3145L10.4346 9.4458C10.6877 9.24893 10.6877 8.85518 10.4346 8.60205Z"
  //               fill=""
  //             />
  //           </g>
  //           <defs>
  //             <clipPath id="clip0_130_9814">
  //               <rect
  //                 width="18"
  //                 height="18"
  //                 fill="white"
  //                 transform="translate(0 0.052124)"
  //               />
  //             </clipPath>
  //           </defs>
  //         </svg>
  //       ),
  //       label: "Authentication",
  //       route: "#",
  //       children: [
  //         { label: "Sign In", route: "/auth/signin" },
  //         { label: "Sign Up", route: "/auth/signup" },
  //       ],
  //     },
  //   ],
  // },
];

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const pathname = usePathname();
  const [pageName, setPageName] = useLocalStorage("selectedMenu", "dashboard");

  return (
    <ClickOutside onClick={() => setSidebarOpen(false)}>
      <aside
        className={`fixed left-0 top-0 z-9999 flex h-screen w-60 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* <!-- SIDEBAR HEADER --> */}
        <div className="flex items-center justify-between gap-2 px-4 py-5.5 lg:py-6.5">
          <Link href="/">
            <Image
              width={80}
              height={16}
              src={"/images/logo/logo.png"}
              alt="Logo"
              priority
            />
          </Link>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-controls="sidebar"
            className="block lg:hidden"
          >
            <svg
              className="fill-current"
              width="20"
              height="18"
              viewBox="0 0 20 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
                fill=""
              />
            </svg>
          </button>
        </div>
        {/* <!-- SIDEBAR HEADER --> */}

        <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
          {/* <!-- Sidebar Menu --> */}
          <nav className="mt-5 px-4 py-4 lg:mt-9 lg:px-6">
            {menuGroups.map((group, groupIndex) => (
              <div key={groupIndex}>
                <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
                  {group.name}
                </h3>

                <ul className="mb-6 flex flex-col gap-1.5">
                  {group.menuItems.map((menuItem, menuIndex) => (
                    <SidebarItem
                      key={menuIndex}
                      item={menuItem}
                      pageName={pageName}
                      setPageName={setPageName}
                    />
                  ))}
                </ul>
              </div>
            ))}
          </nav>
          {/* <!-- Sidebar Menu --> */}
        </div>
      </aside>
    </ClickOutside>
  );
};

export default Sidebar;
