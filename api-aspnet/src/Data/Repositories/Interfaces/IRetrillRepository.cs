using api_aspnet.src.Entities;

namespace api_aspnet.src.Data.Repositories.Interfaces;

public interface IRetrillRepository {
	void CreateRetrill(Retrill retrill);
	void RemoveRetrill(int userId, int trillId);
	bool HasUserRetrilled(int userId, int trillId);
	Task<bool> SaveAllAsync();
}
