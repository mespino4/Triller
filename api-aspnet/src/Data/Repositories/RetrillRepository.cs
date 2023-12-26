using api_aspnet.src.Data.Repositories.Interfaces;
using api_aspnet.src.Entities;

namespace api_aspnet.src.Data.Repositories;

public class RetrillRepository : IRetrillRepository{
	private readonly DataContext _context;

	public RetrillRepository(DataContext context) {
		_context = context;
	}

	public void CreateRetrill(Retrill retrill) {
		_context.Retrills.Add(retrill);
	}
	public void RemoveRetrill(int userId, int trillId) {
		// Remove the repost from the database
		var existingRetrill = _context.Retrills
			.SingleOrDefault(r => r.UserId == userId && r.TrillId == trillId);

		if(existingRetrill != null) {
			_context.Retrills.Remove(existingRetrill);
		}
	}

	public bool HasUserRetrilled(int userId, int trillId) {
		return _context.Retrills.Any(r => r.UserId == userId && r.TrillId == trillId);
	}

	public async Task<bool> SaveAllAsync() {
		return await _context.SaveChangesAsync() > 0;
	}
}
