import type { LoaderArgs } from "@remix-run/node";
import { z } from "zod";
import { json, useLoaderData } from "remix-supertyped";
import { withZod } from "@remix-validated-form/with-zod";
import { DataTable } from "mantine-datatable";
import { PercentageBadge, StatusBadge } from "~/shared/components/CMBadge";
import { GetDateFormatted } from "~/shared/utils.tsx/date";
import { useNavigate, useTransition } from "@remix-run/react";
import { numericString } from "~/shared/utils.tsx/validate";
import { GetTenant } from "~/middleware/tenant";
import { ContentController } from "~/controllers/content.server";
import { UserController } from "~/controllers/user.server";
import { useLoadingDelay } from "~/shared/hooks/useLoadingDelay";
import DashboardContainer from "~/shared/components/DashboardContainer";

export const validator = withZod(
  z.object({
    order: z.enum(["asc", "desc"]).default("desc"),
    orderBy: z
      .enum(["id", "name", "createdAt", "signInMethod", "status"])
      .default("createdAt"),
    page: numericString(z.number().min(1).default(1)),
    perPage: numericString(z.number().min(1).max(100).default(20)),
  })
);

export async function loader({ request, params }: LoaderArgs) {
  const tenant = await GetTenant(request, params);
  const url = new URL(request.url);
  const res = await validator.validate(url.searchParams);
  if (res.error) {
    throw new Error(`Invalid query params: ${url.searchParams.toString()}`);
  }
  const { order, orderBy, perPage } = res.data;
  let page = res.data.page;
  const userController = new UserController(tenant);
  const allUsersCount = await userController.getAllUsersCount();
  if ((page - 1) * perPage > allUsersCount) {
    page = 1;
  }
  const users = await userController.getUsers({
    order,
    orderBy,
    page,
    perPage,
  });
  const contentController = new ContentController(tenant);
  const userStats = await Promise.all(
    users.map((u) => contentController.getUserContentsStats(u.id))
  );
  const usersWithStats = users.map((u, i) => ({ ...u, stats: userStats[i] }));
  return json({
    users: usersWithStats,
    order,
    orderBy,
    page,
    perPage,
    allUsersCount,
  });
}

export default function Users() {
  const transition = useTransition();
  const data = useLoaderData<typeof loader>();
  const { users, order, orderBy, page, perPage, allUsersCount } = data;

  const navigate = useNavigate();

  function updateTable({
    newPage,
    newPerPage,
    newOrderBy,
    newOrder,
  }: {
    newPage?: number;
    newPerPage?: number;
    newOrderBy?: string;
    newOrder?: string;
  }) {
    const url = new URL(window.location.href);
    url.searchParams.set("page", String(newPage ?? page));
    url.searchParams.set("perPage", String(newPerPage ?? perPage));
    url.searchParams.set("orderBy", newOrderBy ?? orderBy);
    url.searchParams.set("order", newOrder ?? order);
    navigate(url);
  }

  const loading = useLoadingDelay(transition.state !== "idle", {});

  return (
    <DashboardContainer title="Users">
      <DataTable
        loaderSize="lg"
        fetching={loading}
        withColumnBorders
        striped
        highlightOnHover
        // provide data
        records={users}
        // define columns "id", "name", "createdAt", "signInMethod", "status"
        columns={[
          { accessor: "name", sortable: true },
          {
            accessor: "createdAt",
            sortable: true,
            render: ({ createdAt }) => (
              <span>{GetDateFormatted(createdAt)}</span>
            ),
          },
          { accessor: "signInMethod", sortable: true },
          {
            accessor: "status",
            sortable: true,
            render: ({ status }) => <StatusBadge status={status} />,
          },
          {
            accessor: "Allowed",
            render: (user) => (
              <PercentageBadge
                percentage={(user.stats.allowed / user.stats.total) * 100}
                status="allowed"
              />
            ),
          },
          {
            accessor: "Flagged",
            render: (user) => (
              <PercentageBadge
                percentage={(user.stats.flagged / user.stats.total) * 100}
                status="flagged"
              />
            ),
          },
          {
            accessor: "Hidden",
            render: (user) => (
              <PercentageBadge
                percentage={(user.stats.hidden / user.stats.total) * 100}
                status="hidden"
              />
            ),
          },
        ]}
        onSortStatusChange={(status) => {
          updateTable({
            newOrderBy: status.columnAccessor,
            newOrder: status.direction,
          });
        }}
        onPageChange={(page) => {
          updateTable({
            newPage: page,
          });
        }}
        page={page}
        recordsPerPage={perPage}
        totalRecords={allUsersCount}
        sortStatus={{
          columnAccessor: orderBy,
          direction: order as "asc" | "desc",
        }}

        // execute this callback when a row is clicked
        //   onRowClick={({ name, party, bornIn }) =>
        //     alert(
        //       `You clicked on ${name}, a ${party.toLowerCase()} president born in ${bornIn}`
        //     )
        //   }
      />
    </DashboardContainer>
  );
}
