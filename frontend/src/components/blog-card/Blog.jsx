import { blogData } from "../../staticData/data";
import { useNavigate } from "react-router-dom";

function Blog() {
  const navigate = useNavigate();

  // Get only the 4 latest blogs sorted by date
  const sortedBlogs = blogData
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 4);

  const blogDataElement = sortedBlogs.map((blog) => {
    return (
      <div
        onClick={() => navigate(`/blog/${blog.id}`)}
        key={blog.id}
        className="bg-white p-3 border border-spacing-1 rounded-xl flex flex-col md:flex-row overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 h-auto md:h-[250px]"
      >
        <div className="overflow-hidden group relative w-full md:w-[60%]">
          <img
            src={blog.image}
            alt={blog.title}
            className="w-[100%] h-48 md:h-72 object-cover rounded-2xl transition-transform duration-300 group-hover:scale-110"
          />
          <p className="text-black rounded-t-xl absolute bg-white z-10 bottom-0 right-6 text-md font-semibold pt-3 px-8 capitalize">
            {blog.date}
          </p>
        </div>

        <div className="p-4 md:ml-4 flex flex-col justify-between">
          <p className="text-[15px] font-semibold mb-2 text-gray-500 uppercase">
            {blog.category}
          </p>
          <h3 className="text-[20px] font-semibold text-gray-800 leading-loose ">
            {blog.title}
          </h3>

          <button
            onClick={() => navigate(`/blog/${blog.id}`)}
            className="mt-4 md:mt-16 text-teal-800 text-sm font-medium flex items-center gap-2 hover:underline md:font-semibold"
          >
            View More <span>→</span>
          </button>
        </div>
      </div>
    );
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 w-full">
      {blogDataElement}
    </div>
  );
}

export default Blog;
