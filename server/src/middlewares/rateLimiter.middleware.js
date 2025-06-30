import rateLimit from "../config/upstash.config.js";

const rateLimiter = async (req, res, next) => {
  try {
    // TODO: put userId or ipAddress as the key
    const { success } = await rateLimit.limit("my-rate-limit");

    if (!success) {
      return res.status(429).json({
        message: "Too many requests, please try again later",
        success: false,
      });
    }

    next();
  } catch (error) {
    console.error("Error in rate limiter middleware: ", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export default rateLimiter;
