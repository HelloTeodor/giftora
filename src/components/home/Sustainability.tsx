export function Sustainability() {
  return (
    <div
      data-name="section_container"
      className="relative w-full flex justify-center overflow-hidden"
    >
      {/* SCALE WRAPPER */}
      <div className="scale-[0.85] origin-top">

        <section className="relative w-[90%] mx-auto py-16">

          {/* WATERCOLOUR IMAGE */}
          <img
            src="https://res.cloudinary.com/dwastb4mg/image/upload/v1775496985/ChatGPT_Image_Apr_1_2026_at_11_40_18_PM_Background_Removed_tdmrh1.png"
            className="absolute left-[-150px] top-1/2 -translate-y-1/2 w-[750px] max-w-none z-0 pointer-events-none select-none"
            alt=""
          />

          {/* MAIN CONTENT */}
          <div className="relative grid lg:grid-cols-2 items-center z-10">

            {/* LEFT TEXT */}
            <div className="flex justify-center lg:justify-start">
              <div className="max-w-[420px] text-center lg:text-left ml-12">

                <h2 className="serif text-[42px] leading-tight text-[#2f4f4f] mb-6">
                  Our Commitment <br />
                  to Sustainability
                </h2>

                <p className="text-gray-600 text-[15px] leading-relaxed mb-6">
                  As a family-owned business, we believe in thoughtful gifting
                  that doesn&apos;t harm the earth. We use eco-friendly materials,
                  sustainable practices, and a personalized touch to create gifts
                  that bring joy to the heart and home.
                </p>

                <button
                  className="bg-[#2f6f73] text-white px-7 py-3 text-xs tracking-[0.25em] rounded-sm"
                >
                  LOVINGLY MADE
                </button>

                <p className="mt-3 text-sm text-gray-600">
                  Eco-Friendly Packaging.
                </p>

                {/* dots */}
                <div className="flex justify-center lg:justify-start gap-2 mt-4">
                  <span className="w-2 h-2 bg-[#caa86a] rounded-full"></span>
                  <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
                  <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
                  <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
                </div>

              </div>
            </div>

            {/* RIGHT WHITE CARD */}
            <div className="relative">
              <div className="bg-white rounded-sm shadow-lg p-8 ml-[-100px]">

                {/* HEADING */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex-1 h-px bg-gray-300"></div>

                  <h3 className="text-[11px] tracking-[0.35em] text-gray-500 whitespace-nowrap">
                    SHOP BEST SELLERS
                  </h3>

                  <div className="flex-1 h-px bg-gray-300"></div>
                </div>

                {/* GRID */}
                <div className="grid grid-cols-2 gap-8">

                  {/* CARD */}
                  <div>
                    <img
                      src="https://images.unsplash.com/photo-1607083206968-13611e3d76db?q=80&w=800"
                      className="rounded-sm mb-3 w-full h-[150px] object-cover"
                      alt=""
                    />
                    <p className="text-[10px] tracking-[0.25em] text-[#caa86a] mb-1">
                      PERSONALIZE IT
                    </p>
                    <h4 className="serif text-[18px] text-gray-800">
                      Make a Wish Birthday
                    </h4>
                    <p className="text-sm text-gray-500 italic">
                      From $59.60
                    </p>
                  </div>

                  {/* CARD */}
                  <div>
                    <img
                      src="https://images.unsplash.com/photo-1607083206325-caf1edba7a0f?q=80&w=800"
                      className="rounded-sm mb-3 w-full h-[150px] object-cover"
                      alt=""
                    />
                    <p className="text-[10px] tracking-[0.25em] text-[#caa86a] mb-1">
                      PERSONALIZE IT
                    </p>
                    <h4 className="serif text-[18px] text-gray-800">
                      Make a Wish Birthday
                    </h4>
                    <p className="text-sm text-gray-500 italic">
                      From $60.40
                    </p>
                  </div>

                  {/* CARD */}
                  <div>
                    <img
                      src="https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=800"
                      className="rounded-sm mb-3 w-full h-[150px] object-cover"
                      alt=""
                    />
                    <p className="text-[10px] tracking-[0.25em] text-[#caa86a] mb-1">
                      PERSONALIZE IT
                    </p>
                    <h4 className="serif text-[18px] text-gray-800">
                      Sweet Sunshine Box
                    </h4>
                  </div>

                  {/* CARD */}
                  <div>
                    <img
                      src="https://images.unsplash.com/photo-1610701596061-2ecf227e85b2?q=80&w=800"
                      className="rounded-sm mb-3 w-full h-[150px] object-cover"
                      alt=""
                    />
                    <p className="text-[10px] tracking-[0.25em] text-[#caa86a] mb-1">
                      PERSONALIZE IT
                    </p>
                    <h4 className="serif text-[18px] text-gray-800">
                      Home Sweet Home Box
                    </h4>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </section>

      </div>
    </div>
  );
}
