import { Link } from "react-router";
import {
  ManagementRestrictedHeader,
  OrganizationPluginDisabledCard,
} from "./organization-plugin-disabled";

interface OrganizationDetailPluginDisabledProps {
  backTo?: string;
}

export function OrganizationDetailPluginDisabled({
  backTo = "/dashboard/organizations",
}: OrganizationDetailPluginDisabledProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to={backTo} className="text-gray-500 hover:text-gray-700">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </Link>
        <ManagementRestrictedHeader title="Organization" />
      </div>

      <OrganizationPluginDisabledCard />
    </div>
  );
}
