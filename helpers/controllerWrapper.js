const controllerWrapper = (controller) => {
  const func = async (req, res, next) => {
    try {
      await controller(req, res, next);
    } catch (error) {
      if (error instanceof ValidationError) {
        error.status = 400;
      }
      next(error);
    }
  };
  return func;
};

export default controllerWrapper;
