export default function UserRules() {
  return (
    <div className="flex flex-grow flex-col items-start justify-start gap-4 self-stretch p-4">
      <div className="relative flex flex-shrink-0 flex-grow-0 items-center justify-between self-stretch">
        <p className="flex-shrink-0 flex-grow-0 text-left text-lg font-semibold text-black">
          Rulesets (Users)
        </p>
        <div className="relative flex flex-shrink-0 flex-grow-0 items-center justify-center gap-2.5 rounded-[10px] bg-[#2f80ed] px-4 py-2">
          <p className="flex-shrink-0 flex-grow-0 text-center text-base font-semibold text-white">
            Add Rule
          </p>
        </div>
      </div>
      <div className="flex h-[519px] flex-shrink-0 flex-grow-0 flex-col items-start justify-start gap-2 self-stretch">
        <div className="relative flex flex-shrink-0 flex-grow-0 items-center justify-start gap-3 self-stretch rounded-2xl bg-white p-3">
          <div className="relative flex h-6 w-6 flex-shrink-0 flex-grow-0 flex-col items-center justify-center gap-2.5 rounded-xl border border-[#bdbdbd] p-1">
            <p className="flex-shrink-0 flex-grow-0 text-left text-base text-black">
              1
            </p>
          </div>
          <div className="relative flex flex-shrink-0 flex-grow-0 items-start justify-start gap-2.5">
            <p className="w-[500px] flex-shrink-0 flex-grow-0 text-left text-base text-black">
              Allow if admin user
            </p>
          </div>
          <div className="relative flex flex-shrink-0 flex-grow-0 items-center justify-start gap-2.5">
            <p className="flex-shrink-0 flex-grow-0 text-left text-base font-semibold text-black">
              Action:
            </p>
            <div className="relative flex flex-shrink-0 flex-grow-0 items-center justify-center gap-2.5 rounded-[10px] bg-[#40c057] px-2 py-1">
              <p className="flex-shrink-0 flex-grow-0 text-center text-xs font-semibold text-white">
                Allowed
              </p>
            </div>
          </div>
          <div className="relative flex flex-shrink-0 flex-grow-0 items-center justify-start gap-2.5">
            <p className="flex-shrink-0 flex-grow-0 text-left text-base font-semibold text-black">
              Reason:
            </p>
            <p className="flex-shrink-0 flex-grow-0 text-left text-base text-black">
              Internal user
            </p>
          </div>
          <div className="relative h-7 w-[318px] flex-grow self-stretch overflow-hidden" />
          <p className="flex-shrink-0 flex-grow-0 text-left text-lg font-bold text-black">
            v
          </p>
        </div>
        <div className="relative flex flex-shrink-0 flex-grow-0 items-center justify-start gap-3 self-stretch rounded-2xl bg-white p-3">
          <div className="relative flex h-6 w-6 flex-shrink-0 flex-grow-0 flex-col items-center justify-center gap-2.5 rounded-xl border border-[#bdbdbd] p-1">
            <p className="flex-shrink-0 flex-grow-0 text-left text-base text-black">
              2
            </p>
          </div>
          <div className="relative flex flex-shrink-0 flex-grow-0 items-start justify-start gap-2.5">
            <p className="w-[500px] flex-shrink-0 flex-grow-0 text-left text-base text-black">
              Flag content if user is flagged
            </p>
          </div>
          <div className="relative flex flex-shrink-0 flex-grow-0 items-center justify-start gap-2.5">
            <p className="flex-shrink-0 flex-grow-0 text-left text-base font-semibold text-black">
              Action:
            </p>
            <div className="relative flex flex-shrink-0 flex-grow-0 items-center justify-center gap-2.5 rounded-[10px] bg-[#f0b033] px-2 py-1">
              <p className="flex-shrink-0 flex-grow-0 text-center text-xs font-semibold text-white">
                Flagged
              </p>
            </div>
          </div>
          <div className="relative flex flex-shrink-0 flex-grow-0 items-center justify-start gap-2.5">
            <p className="flex-shrink-0 flex-grow-0 text-left text-base font-semibold text-black">
              Reason:
            </p>
            <p className="flex-shrink-0 flex-grow-0 text-left text-base text-black">
              Inherit user reason
            </p>
          </div>
          <div className="relative h-7 w-[258px] flex-grow self-stretch overflow-hidden" />
          <div className="relative flex flex-shrink-0 flex-grow-0 items-start justify-start gap-1">
            <p className="flex-shrink-0 flex-grow-0 text-left text-lg font-bold text-black">
              v
            </p>
            <p className="flex-shrink-0 flex-grow-0 text-left text-lg font-bold text-black">
              v
            </p>
          </div>
        </div>
        <div className="relative flex flex-shrink-0 flex-grow-0 items-center justify-start gap-3 self-stretch rounded-2xl bg-white p-3">
          <div className="relative flex h-6 w-6 flex-shrink-0 flex-grow-0 flex-col items-center justify-center gap-2.5 rounded-xl border border-[#bdbdbd] p-1">
            <p className="flex-shrink-0 flex-grow-0 text-left text-base text-black">
              3
            </p>
          </div>
          <div className="relative flex flex-shrink-0 flex-grow-0 items-start justify-start gap-2.5">
            <p className="w-[500px] flex-shrink-0 flex-grow-0 text-left text-base text-black">
              Flag content if user is hidden
            </p>
          </div>
          <div className="relative flex flex-shrink-0 flex-grow-0 items-center justify-start gap-2.5">
            <p className="flex-shrink-0 flex-grow-0 text-left text-base font-semibold text-black">
              Action:
            </p>
            <div className="relative flex flex-shrink-0 flex-grow-0 items-center justify-center gap-2.5 rounded-[10px] bg-[#f0334a] px-2 py-1">
              <p className="flex-shrink-0 flex-grow-0 text-center text-xs font-semibold text-white">
                Hidden
              </p>
            </div>
          </div>
          <div className="relative flex flex-shrink-0 flex-grow-0 items-center justify-start gap-2.5">
            <p className="flex-shrink-0 flex-grow-0 text-left text-base font-semibold text-black">
              Reason:
            </p>
            <p className="flex-shrink-0 flex-grow-0 text-left text-base text-black">
              Inherit user reason
            </p>
          </div>
          <div className="relative h-7 w-[229.11px] flex-grow self-stretch overflow-hidden" />
          {/* <img
            src="screen-shot-2022-11-24-at-12.38-2.png"
            className="h-6 w-[19.89px] flex-shrink-0 flex-grow-0 object-cover"
          /> */}
          <div className="relative flex flex-shrink-0 flex-grow-0 items-start justify-start gap-1">
            <p className="flex-shrink-0 flex-grow-0 text-left text-lg font-bold text-black">
              v
            </p>
            <p className="flex-shrink-0 flex-grow-0 text-left text-lg font-bold text-black">
              v
            </p>
          </div>
        </div>
        <div className="relative flex flex-shrink-0 flex-grow-0 flex-col items-start justify-start gap-2 self-stretch rounded-2xl bg-white p-3">
          <div className="flex flex-shrink-0 flex-grow-0 items-center justify-end gap-2.5 self-stretch">
            <div className="relative flex flex-shrink-0 flex-grow-0 items-start justify-start gap-1">
              <p className="flex-shrink-0 flex-grow-0 text-left text-lg font-bold text-black">
                v
              </p>
              <p className="flex-shrink-0 flex-grow-0 text-left text-lg font-bold text-black">
                v
              </p>
            </div>
          </div>
          <p className="flex-shrink-0 flex-grow-0 text-center text-lg font-semibold text-black">
            Description
          </p>
          <div className="flex flex-shrink-0 flex-grow-0 flex-col items-start justify-center gap-2.5">
            <div className="flex w-[430px] flex-shrink-0 flex-grow-0 flex-col items-start justify-start overflow-hidden">
              <div className="flex h-[50px] flex-shrink-0 flex-grow-0 flex-col items-start justify-center gap-2.5 self-stretch rounded-lg border border-[#ced4da] py-1.5">
                <div className="relative flex flex-shrink-0 flex-grow-0 items-center justify-start px-[16.66670036315918px] py-px">
                  <p className="flex-shrink-0 flex-grow-0 text-left text-lg text-[#adb5bd]">
                    Placeholder text
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative flex flex-shrink-0 flex-grow-0 items-start justify-start gap-3 self-stretch rounded border border-[#e0e0e0] p-3">
            <p className="flex-shrink-0 flex-grow-0 text-left text-base text-black">
              If{" "}
            </p>
            <div className="flex w-[200px] flex-shrink-0 flex-grow-0 flex-col items-start justify-start overflow-hidden">
              <div className="flex h-[30px] flex-shrink-0 flex-grow-0 items-center justify-between self-stretch rounded-sm border border-[#ced4da] py-1.5">
                <div className="relative flex flex-shrink-0 flex-grow-0 items-center justify-start px-2.5 py-px">
                  <p className="flex-shrink-0 flex-grow-0 text-left text-xs text-[#adb5bd]">
                    Location
                  </p>
                </div>
                <div className="relative flex h-[30px] flex-shrink-0 flex-grow-0 items-center justify-start gap-2.5 overflow-hidden px-2 py-[9px]">
                  <svg
                    width={15}
                    height={16}
                    viewBox="0 0 15 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="relative h-[15px] w-[15px] flex-shrink-0 flex-grow-0"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M5 10.5L7.5 13L10 10.5"
                      stroke="#868E96"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M5 5.5L7.5 3L10 5.5"
                      stroke="#868E96"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <div className="flex w-[200px] flex-shrink-0 flex-grow-0 flex-col items-start justify-start overflow-hidden">
              <div className="flex h-[30px] flex-shrink-0 flex-grow-0 items-center justify-between self-stretch rounded-sm border border-[#ced4da] py-1.5">
                <div className="relative flex flex-shrink-0 flex-grow-0 items-center justify-start px-2.5 py-px">
                  <p className="flex-shrink-0 flex-grow-0 text-left text-xs text-[#adb5bd]">
                    Is not
                  </p>
                </div>
                <div className="relative flex h-[30px] flex-shrink-0 flex-grow-0 items-center justify-start gap-2.5 overflow-hidden px-2 py-[9px]">
                  <svg
                    width={15}
                    height={16}
                    viewBox="0 0 15 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="relative h-[15px] w-[15px] flex-shrink-0 flex-grow-0"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M5 10.5L7.5 13L10 10.5"
                      stroke="#868E96"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M5 5.5L7.5 3L10 5.5"
                      stroke="#868E96"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <div className="flex w-[200px] flex-shrink-0 flex-grow-0 flex-col items-start justify-start overflow-hidden">
              <div className="flex h-[30px] flex-shrink-0 flex-grow-0 items-center justify-between self-stretch rounded-sm border border-[#ced4da] py-1.5">
                <div className="relative flex flex-shrink-0 flex-grow-0 items-center justify-start px-2.5 py-px">
                  <p className="flex-shrink-0 flex-grow-0 text-left text-xs text-[#adb5bd]">
                    Allowed locations list
                  </p>
                </div>
                <div className="relative flex h-[30px] flex-shrink-0 flex-grow-0 items-center justify-start gap-2.5 overflow-hidden px-2 py-[9px]">
                  <svg
                    width={15}
                    height={16}
                    viewBox="0 0 15 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="relative h-[15px] w-[15px] flex-shrink-0 flex-grow-0"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M5 10.5L7.5 13L10 10.5"
                      stroke="#868E96"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M5 5.5L7.5 3L10 5.5"
                      stroke="#868E96"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <div className="flex flex-grow flex-col items-end justify-start gap-2.5">
              <div className="relative flex flex-shrink-0 flex-grow-0 items-center justify-center gap-2.5 rounded-[30px] bg-[#f0334a] px-2 py-1">
                <p className="flex-shrink-0 flex-grow-0 text-center text-base font-semibold text-white">
                  X
                </p>
              </div>
            </div>
          </div>
          <div className="relative flex flex-shrink-0 flex-grow-0 items-start justify-start gap-3 self-stretch rounded border border-[#e0e0e0] p-3">
            <p className="flex-shrink-0 flex-grow-0 text-left text-base text-black">
              If{" "}
            </p>
            <div className="flex w-[200px] flex-shrink-0 flex-grow-0 flex-col items-start justify-start overflow-hidden">
              <div className="flex h-[30px] flex-shrink-0 flex-grow-0 items-center justify-between self-stretch rounded-sm border border-[#ced4da] py-1.5">
                <div className="relative flex flex-shrink-0 flex-grow-0 items-center justify-start px-2.5 py-px">
                  <p className="flex-shrink-0 flex-grow-0 text-left text-xs text-[#adb5bd]">
                    Location
                  </p>
                </div>
                <div className="relative flex h-[30px] flex-shrink-0 flex-grow-0 items-center justify-start gap-2.5 overflow-hidden px-2 py-[9px]">
                  <svg
                    width={15}
                    height={16}
                    viewBox="0 0 15 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="relative h-[15px] w-[15px] flex-shrink-0 flex-grow-0"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M5 10.5L7.5 13L10 10.5"
                      stroke="#868E96"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M5 5.5L7.5 3L10 5.5"
                      stroke="#868E96"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <div className="flex w-[200px] flex-shrink-0 flex-grow-0 flex-col items-start justify-start overflow-hidden">
              <div className="flex h-[30px] flex-shrink-0 flex-grow-0 items-center justify-between self-stretch rounded-sm border border-[#ced4da] py-1.5">
                <div className="relative flex flex-shrink-0 flex-grow-0 items-center justify-start px-2.5 py-px">
                  <p className="flex-shrink-0 flex-grow-0 text-left text-xs text-[#adb5bd]">
                    Is not
                  </p>
                </div>
                <div className="relative flex h-[30px] flex-shrink-0 flex-grow-0 items-center justify-start gap-2.5 overflow-hidden px-2 py-[9px]">
                  <svg
                    width={15}
                    height={16}
                    viewBox="0 0 15 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="relative h-[15px] w-[15px] flex-shrink-0 flex-grow-0"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M5 10.5L7.5 13L10 10.5"
                      stroke="#868E96"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M5 5.5L7.5 3L10 5.5"
                      stroke="#868E96"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <div className="flex w-[200px] flex-shrink-0 flex-grow-0 flex-col items-start justify-start overflow-hidden">
              <div className="flex h-[30px] flex-shrink-0 flex-grow-0 items-center justify-between self-stretch rounded-sm border border-[#ced4da] py-1.5">
                <div className="relative flex flex-shrink-0 flex-grow-0 items-center justify-start px-2.5 py-px">
                  <p className="flex-shrink-0 flex-grow-0 text-left text-xs text-[#adb5bd]">
                    Allowed locations list
                  </p>
                </div>
                <div className="relative flex h-[30px] flex-shrink-0 flex-grow-0 items-center justify-start gap-2.5 overflow-hidden px-2 py-[9px]">
                  <svg
                    width={15}
                    height={16}
                    viewBox="0 0 15 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="relative h-[15px] w-[15px] flex-shrink-0 flex-grow-0"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M5 10.5L7.5 13L10 10.5"
                      stroke="#868E96"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M5 5.5L7.5 3L10 5.5"
                      stroke="#868E96"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <div className="flex flex-grow flex-col items-end justify-start gap-2.5">
              <div className="relative flex flex-shrink-0 flex-grow-0 items-center justify-center gap-2.5 rounded-[30px] bg-[#f0334a] px-2 py-1">
                <p className="flex-shrink-0 flex-grow-0 text-center text-base font-semibold text-white">
                  X
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-shrink-0 flex-grow-0 flex-col items-end justify-start gap-2 self-stretch px-2">
            <div className="relative flex flex-shrink-0 flex-grow-0 items-center justify-center gap-2.5 rounded-[30px] bg-[#40c057] px-2 py-1">
              <p className="flex-shrink-0 flex-grow-0 text-center text-sm font-semibold text-white">
                +
              </p>
            </div>
          </div>
          <div className="relative flex flex-shrink-0 flex-grow-0 flex-col items-start justify-start gap-2.5 self-stretch py-3">
            <p className="flex-shrink-0 flex-grow-0 text-center text-lg font-semibold text-black">
              Action
            </p>
            <div className="flex w-[413px] flex-shrink-0 flex-grow-0 items-center justify-center gap-4">
              <div className="relative flex flex-grow items-center justify-center gap-2.5 rounded-[10px] bg-[#40c057] px-4 py-2">
                <p className="flex-shrink-0 flex-grow-0 text-center text-base font-semibold text-white">
                  Allow
                </p>
              </div>
              <div className="relative flex flex-grow items-center justify-center gap-2.5 rounded-[10px] bg-[#f0b033] px-4 py-2">
                <p className="flex-shrink-0 flex-grow-0 text-center text-base font-semibold text-white">
                  Flag
                </p>
              </div>
              <div className="relative flex flex-grow items-center justify-center gap-2.5 rounded-[10px] bg-[#f0334a] px-4 py-2">
                <p className="flex-shrink-0 flex-grow-0 text-center text-base font-semibold text-white">
                  Hide
                </p>
              </div>
            </div>
            <p className="flex-shrink-0 flex-grow-0 text-center text-lg font-semibold text-black">
              Reason
            </p>
            <div className="flex flex-shrink-0 flex-grow-0 items-start justify-start gap-2.5">
              <div className="flex h-[42px] w-[300px] flex-shrink-0 flex-grow-0 items-center justify-between rounded-sm border border-[#ced4da] py-1.5">
                <div className="relative flex flex-shrink-0 flex-grow-0 items-center justify-start px-2.5 py-px">
                  <p className="flex-shrink-0 flex-grow-0 text-left text-xs text-[#adb5bd]">
                    Allowed locations list
                  </p>
                </div>
                <div className="relative flex h-[30px] flex-shrink-0 flex-grow-0 items-center justify-start gap-2.5 overflow-hidden px-2 py-[9px]">
                  <svg
                    width={15}
                    height={16}
                    viewBox="0 0 15 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="relative h-[15px] w-[15px] flex-shrink-0 flex-grow-0"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M5 10.5L7.5 13L10 10.5"
                      stroke="#868E96"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M5 5.5L7.5 3L10 5.5"
                      stroke="#868E96"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>
              </div>
              <div className="relative flex flex-shrink-0 flex-grow-0 items-center justify-center gap-2.5 rounded-[10px] bg-[#2f80ed] px-4 py-2">
                <p className="flex-shrink-0 flex-grow-0 text-center text-base font-semibold text-white">
                  Add Reason
                </p>
              </div>
            </div>
            <p className="flex-shrink-0 flex-grow-0 text-center text-lg font-semibold text-black">
              Options
            </p>
            <div className="relative flex flex-shrink-0 flex-grow-0 items-center justify-start gap-2">
              <div className="relative h-4 w-4 flex-shrink-0 flex-grow-0">
                <div className="absolute left-[-1px] top-[-1px] h-4 w-4 rounded-sm border border-[#ced4da]" />
              </div>
              <p className="flex-shrink-0 flex-grow-0 text-center text-lg font-semibold text-black">
                Terminate if matches this rule
              </p>
              {/* <img
                src="screen-shot-2022-11-24-at-12.38-2.png"
                className="h-6 w-[19.89px] flex-shrink-0 flex-grow-0 object-cover"
              /> */}
            </div>
            <div className="relative flex flex-shrink-0 flex-grow-0 items-center justify-start gap-2">
              <div className="relative h-4 w-4 flex-shrink-0 flex-grow-0">
                <div className="absolute left-[-1px] top-[-1px] h-4 w-4 rounded-sm border border-[#ced4da]" />
              </div>
              <p className="flex-shrink-0 flex-grow-0 text-center text-lg font-semibold text-black">
                Skip if rule already has been applied
              </p>
            </div>
            <div className="flex flex-shrink-0 flex-grow-0 flex-col items-end justify-start gap-2.5 self-stretch">
              <div className="relative flex flex-shrink-0 flex-grow-0 items-center justify-center gap-2.5 rounded-[10px] bg-[#2f80ed] px-4 py-2">
                <p className="flex-shrink-0 flex-grow-0 text-center text-base font-semibold text-white">
                  Add Rule
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
