import type { LoaderArgs } from "@remix-run/node";
import { useCallback, useEffect, useRef, useState } from "react";
import { json, useLoaderData } from "remix-supertyped";
import ContentBox from "~/shared/components/ContentBox";
import { useSocket } from "~/shared/contexts/SocketContext";
import { JSONParseWithDates } from "~/shared/utils.tsx/json";
import { Outlet, useParams } from "@remix-run/react";
import { DashboardInnerContainer } from "~/shared/components/DashboardInnerContainer";
import { Selectors } from "~/shared/components/FilterSelectors";
import { FilterController } from "~/controllers/filter.server";
import { GetModeratorAndTenant } from "~/middleware/tenant";
import { ContentController } from "~/controllers/content.server";
import type { ContentWithInfo } from "~/models/content";
import { AreContentsEqual } from "~/models/content";

export async function loader({ request, params }: LoaderArgs) {
  const { moderator, tenant } = await GetModeratorAndTenant(request, params);
  const filterController = new FilterController(tenant, moderator);
  const filter = await filterController.getModeratorFilter();
  const filterInfo = await filterController.getFilterInfo();
  const contentController = new ContentController(tenant);
  const contents = await contentController.getContents(filter);
  contents.reverse(); // to make sure the contents are at the bottom
  return json({ contents, filterInfo, filter });
}

export default function Contents() {
  const params = useParams();
  const currentContentId = params["contentId"];
  const data = useLoaderData<typeof loader>();
  const { filterInfo, filter, contents: dataContents } = data;
  const [contents, setContents] = useState<ContentWithInfo[]>(
    dataContents ?? []
  );
  const [showScrollBottomButton, setShowScrollBottomButton] = useState(false);

  const socket = useSocket();
  const bottomLineRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const scrolling = useRef(false);
  const shouldDoLastScroll = useRef(false);
  const prevScroll = useRef(0);
  const shouldAutoScroll = useRef(true);
  const dataContentsRef = useRef(dataContents);

  const scrollToBottom = useCallback(() => {
    if (!bottomLineRef.current || !listRef.current) {
      return;
    }

    if (shouldAutoScroll.current) {
      if (!scrolling.current) {
        scrolling.current = true;
        bottomLineRef.current.scrollIntoView({ behavior: "smooth" });
        setTimeout(() => {
          scrolling.current = false;
          if (shouldDoLastScroll.current) {
            shouldDoLastScroll.current = false;
            scrollToBottom();
          }
        }, 500);
      } else {
        shouldDoLastScroll.current = true;
      }
    }
  }, [bottomLineRef, listRef, scrolling, shouldDoLastScroll]);

  useEffect(() => {
    if (!socket) return;
    const handler = socket.on("new-content", (newContentData) => {
      const newContent = JSONParseWithDates(newContentData)
        .content as ContentWithInfo;
      setContents((contents) => [...contents, newContent]);
      scrollToBottom();
    });
    return () => {
      console.log("Disconnect handler");
      handler.disconnect();
    };
  }, [socket, setContents, scrollToBottom]);

  useEffect(() => {
    if (!AreContentsEqual(dataContents, dataContentsRef.current)) {
      dataContentsRef.current = dataContents;
      setContents(dataContents);
    }
  }, [dataContents, dataContentsRef]);

  // Scroll to bottom on first render
  useEffect(() => {
    scrollToBottom();
  }, [scrollToBottom]);

  function onWheel(event: any) {
    const scrollY = listRef.current?.scrollTop ?? 0;
    if (prevScroll.current === scrollY && scrollY !== 0) {
      // console.log("at the bottom:", shouldAutoScroll.current);
      // Scrolled to the bottom
      shouldAutoScroll.current = true;
    } else {
      // Scrolling not at the bottom
      shouldAutoScroll.current = false;
    }
    prevScroll.current = scrollY;
  }

  function onScroll(event: any) {
    const st = listRef.current?.scrollTop ?? 0;
    const sh = listRef.current?.scrollHeight ?? 0;
    const ch = listRef.current?.clientHeight ?? 0;
    if (sh - st === ch || shouldAutoScroll.current) {
      setShowScrollBottomButton(false);
    } else {
      setShowScrollBottomButton(true);
    }
  }
  return (
    <div className="flex  h-[840px] flex-row justify-items-stretch gap-4">
      <div className="relative flex-1">
        <div className="flex  pb-4">
          <Selectors filter={filter} {...filterInfo} />
        </div>
        <DashboardInnerContainer className="h-[790px]">
          <ul
            className="h-full w-full overflow-y-scroll"
            ref={listRef}
            onWheel={onWheel}
            onScroll={onScroll}
          >
            {contents.map((content) => {
              return (
                <ContentBox
                  key={content.id}
                  content={content}
                  project={content.project}
                  topic={content.topic}
                  user={content.user}
                  selected={currentContentId === content.id}
                />
              );
            })}
            <div ref={bottomLineRef}></div>
          </ul>
        </DashboardInnerContainer>
        <div
          className={`absolute left-0 right-0 bottom-3 transition-all duration-200 ${
            showScrollBottomButton
              ? "visible opacity-100"
              : "invisible opacity-0"
          }`}
        >
          <button
            className="m-auto flex items-center gap-1 rounded-lg bg-main px-2 py-1 text-xs font-semibold text-white hover:bg-main-dark"
            onClick={() => {
              shouldAutoScroll.current = true;
              bottomLineRef.current?.scrollIntoView({ behavior: "auto" });
            }}
          >
            Scroll to bottom
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-4 w-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75l3 3m0 0l3-3m-3 3v-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>
        </div>
      </div>
      <Outlet />
    </div>
  );
}
